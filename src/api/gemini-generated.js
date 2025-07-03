const { GoogleGenAI, Modality } = require("@google/genai");
const fs = require("node:fs");
require("dotenv").config();
const { GEMINI_API_KEY } = process.env;

module.exports = async function (prompt) {
  try {
    const ai = new GoogleGenAI({
      apiKey: GEMINI_API_KEY,
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: prompt,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });
    for (const part of response.candidates[0].content.parts) {
      // Based on the part type, either show the text or save the image
      if (part.text) {
        console.log(part.text);
      } else if (part.inlineData) {
        const imageData = part.inlineData.data;
        const buffer = Buffer.from(imageData, "base64");
        return buffer;
      }
    }
  } catch (err) {
    throw err;
  }
};
