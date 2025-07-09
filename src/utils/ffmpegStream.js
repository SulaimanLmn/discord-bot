const ffmpeg = require("fluent-ffmpeg");

function createFFmpegStream(filePath) {
  return ffmpeg(filePath)
    .inputFormat("wav")
    .audioFrequency(48000)
    .audioChannels(2)
    .format("s16le")
    .on("error", (err) => console.error("FFmpeg error:", err))
    .pipe();
}

module.exports = { createFFmpegStream };
