const { GoogleGenAI } = require("@google/genai");
const wav = require("wav");
const { PassThrough } = require("stream");
require("dotenv").config();

const { GEMINI_API_KEY } = process.env;

module.exports = async (text) => {
  const ai = new GoogleGenAI({
    apiKey: GEMINI_API_KEY,
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: "Kore" },
        },
      },
    },
  });

  const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  const pcmBuffer = Buffer.from(data, "base64");

  const wavStream = new PassThrough();
  const writer = new wav.Writer({
    channels: 1,
    sampleRate: 24000,
    bitDepth: 16,
  });

  writer.pipe(wavStream);
  writer.end(pcmBuffer);

  return wavStream;
};
