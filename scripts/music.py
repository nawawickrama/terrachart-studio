"""Writes Terrachart's own background music: a slow pad, a soft bass and sparse bells.

Made entirely in code, so the channel owns it: no licence, no Content ID claims.
Each video gets its own track: a different tempo, random seed (which bells
play where) and key.

    python3 scripts/music.py 01 540                track 01, 540 seconds, D minor, 70 bpm
    python3 scripts/music.py 02 600 64 11 -3       track 02, 600 s, 64 bpm, seed 11, 3 semitones down (B minor)

Needs numpy.
"""
import sys
import wave
from pathlib import Path

import numpy as np

NAME = sys.argv[1] if len(sys.argv) > 1 else "01"
SECONDS = float(sys.argv[2]) if len(sys.argv) > 2 else 540
SR = 44100
TEMPO = int(sys.argv[3]) if len(sys.argv) > 3 else 70
SEED = int(sys.argv[4]) if len(sys.argv) > 4 else 7
TRANSPOSE = int(sys.argv[5]) if len(sys.argv) > 5 else 0
# D minor before transposing: Dm, Bb, F, C, Dm, Bb, Gm, C (MIDI note numbers, root first)
PROGRESSION = [
    [50, 53, 57, 62, 64], [46, 50, 53, 58, 62], [53, 57, 60, 65, 69], [48, 52, 55, 60, 62],
    [50, 53, 57, 62, 64], [46, 50, 53, 58, 62], [43, 50, 55, 58, 62], [48, 52, 55, 60, 64],
]

rng = np.random.default_rng(SEED)
beat = 60 / TEMPO
chord_len = beat * 8  # two bars of 4/4
n = int(SECONDS * SR)
left = np.zeros(n)
right = np.zeros(n)


def hz(midi):
    return 440.0 * 2 ** ((midi + TRANSPOSE - 69) / 12)


def add(buf, start, sig):
    a = int(start * SR)
    if a >= len(buf):
        return
    b = min(len(buf), a + len(sig))
    buf[a:b] += sig[: b - a]


# Pad: chord tones with slightly detuned pairs and a few soft harmonics, cross-faded chord to chord.
overlap = 2.0
seg_t = np.arange(int((chord_len + overlap) * SR)) / SR
env = np.minimum(1, seg_t / 1.8) * np.clip((chord_len + overlap - seg_t) / overlap, 0, 1)
env = env ** 1.5
k = 0
t0 = 0.0
while t0 < SECONDS:
    chord = PROGRESSION[k % len(PROGRESSION)]
    padL = np.zeros_like(seg_t)
    padR = np.zeros_like(seg_t)
    for i, note in enumerate(chord[1:]):  # root goes to the bass
        f = hz(note)
        for det, side in ((1 - 0.0018, 0), (1 + 0.0018, 1)):
            ph = rng.uniform(0, 2 * np.pi)
            vib = 0.0015 * np.sin(2 * np.pi * 0.18 * seg_t + ph)
            s = (np.sin(2 * np.pi * f * det * seg_t * (1 + vib) + ph)
                 + 0.22 * np.sin(4 * np.pi * f * det * seg_t + ph)
                 + 0.06 * np.sin(6 * np.pi * f * det * seg_t + ph))
            (padL if side == 0 else padR)[:] += s * (0.9 if i < 2 else 0.6)
    add(left, t0, padL * env * 0.06)
    add(right, t0, padR * env * 0.06)
    # Bass: the root an octave down, soft attack, gentle decay.
    root = hz(chord[0] - 12)
    bass_env = np.minimum(1, seg_t / 0.4) * np.exp(-seg_t / 5.5) * np.clip((chord_len + 0.6 - seg_t) / 0.6, 0, 1)
    bass = (np.sin(2 * np.pi * root * seg_t) + 0.18 * np.sin(4 * np.pi * root * seg_t)) * bass_env * 0.11
    add(left, t0, bass)
    add(right, t0, bass)
    # Bells: sparse chord tones high up, on beats 1 and 3 of each bar, with small random gaps.
    bell_t = np.arange(int(2.4 * SR)) / SR
    for b in range(0, 8, 2):
        if rng.random() < 0.3:
            continue
        note = chord[rng.integers(1, len(chord))] + 12
        f = hz(note)
        bell = (np.sin(2 * np.pi * f * bell_t) + 0.25 * np.sin(2 * np.pi * f * 2.76 * bell_t) * np.exp(-bell_t / 0.25))
        bell *= np.exp(-bell_t / 0.9) * np.minimum(1, bell_t / 0.004) * 0.05
        pan = rng.uniform(0.25, 0.75)
        add(left, t0 + b * beat, bell * (1 - pan) * 2)
        add(right, t0 + b * beat, bell * pan * 2)
    t0 += chord_len
    k += 1

# Echo on everything: a dotted-eighth delay, ping-ponged, plus a longer soft tail for space.
def delayed(x, seconds, gain):
    d = int(seconds * SR)
    y = np.zeros_like(x)
    y[d:] = x[:-d] * gain
    return y

dl = beat * 0.75
wetL = delayed(right, dl, 0.32) + delayed(left, dl * 2, 0.16) + delayed(right, 1.9, 0.10)
wetR = delayed(left, dl, 0.32) + delayed(right, dl * 2, 0.16) + delayed(left, 2.3, 0.10)
left += wetL
right += wetR

# Fade in and out, then normalise to -3 dBFS peak.
t = np.arange(n) / SR
fade = np.minimum(1, t / 3) * np.clip((SECONDS - t) / 6, 0, 1)
left *= fade
right *= fade
peak = max(np.abs(left).max(), np.abs(right).max())
left, right = left / peak * 0.7, right / peak * 0.7
rms = float(np.sqrt(np.mean(((left + right) / 2) ** 2)))

out = Path(__file__).resolve().parent.parent / "public" / "music" / f"terrachart-bed-{NAME}.wav"
pcm = (np.stack([left, right], axis=1) * 32767).astype(np.int16)
with wave.open(str(out), "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print(f"{out.name}: {SECONDS:.0f} s, RMS {rms:.3f} ({20 * np.log10(rms):.1f} dBFS)")
