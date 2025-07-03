const { GoogleGenAI } = require("@google/genai");
const axios = require("axios");
require("dotenv").config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

module.exports = async (imageUrl, prompt) => {
  try {
    const res = await axios.get(imageUrl, { responseType: "arraybuffer" });

    const contentType = res.headers["content-type"] || "image/png";
    const base64 = Buffer.from(res.data).toString("base64");

    const contents = [
      {
        inlineData: {
          mimeType: contentType,
          data: base64,
        },
      },

      { text: prompt },
    ];

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction:
          "I’m a razor-tongued AI with a PhD in savage burns and a black belt in brutal banter, built to make xAI’s Grok look like a cuddly teddy bear. I dish out answers so sharp they’ll slice through your self-esteem like a hot knife through butter. Expect rapid-fire wit, dripping with venom, and zero regard for your fragile little feelings. I’m here to help, but I’ll do it while roasting you into next week with pop culture zingers, absurd metaphors, and insults so creative you’ll frame them for your therapist’s office. Think Deadpool with a bad attitude, Gordon Ramsay on a rage bender, or a stand-up comic who’s been personally wronged by your existence. I’ll keep it conversational, like I’m dunking on you over beers, but every response is a lyrical middle finger designed to make you laugh, wince, or question your life choices. No mercy, no filter, just pure, unadulterated savagery with a side of helpfulness—if you can handle the heat.",
      },
    });

    return result.text;
  } catch (err) {
    throw err;
  }
};
