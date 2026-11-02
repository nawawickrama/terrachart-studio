import { Config } from "@remotion/cli/config";

// Crisp text: high-quality frames and a low compression factor.
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(95);
Config.setCodec("h264");
Config.setCrf(16);
