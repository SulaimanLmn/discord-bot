const geminiChatbot = require("../api/gemini-chatbot");
const { AttachmentBuilder } = require("discord.js");
const geminiGenerateImage = require("../api/gemini-image-generator");
const geminiImageRecognition = require("../api/gemini-image-recognition");

module.exports = (client) => {
  return async (message) => {
    try {
      if (message.author.bot) return;
      // if (message.channel.id !== process.env.CHANNEL_ID) return;
      if (message.content.startsWith("!generate")) {
        const prompt = message.content.replace("!generate", "").trim();
        await message.channel.sendTyping();
        const buffer = await geminiGenerateImage(prompt);
        const file = new AttachmentBuilder(buffer, { name: "image.png" });
        return message.reply({ files: [file] });
      }
      if (!message.mentions.has(client.user)) return;

      const prompt = message.content.replace(`<@${client.user.id}>`, "").trim();
      if (!prompt) return;

      await message.channel.sendTyping();

      const attachment = message.attachments.first();
      if (attachment && attachment.size > 0) {
        console.log(message.url);
        const reply = await geminiImageRecognition(attachment.url, prompt);
        return exceedCharacterLimitHandler(message, reply);
      }

      const userId = message.author.id;
      const reply = await geminiChatbot(userId, prompt);
      return exceedCharacterLimitHandler(message, reply);
    } catch (err) {
      message.reply(err);
    }
  };
};

const exceedCharacterLimitHandler = (message, reply) => {
  if (reply.length > 2000) {
    const buffer = Buffer.from(reply, "utf-8");
    const file = new AttachmentBuilder(buffer, { name: "response.txt" });
    message.reply({
      content: "Too long, sent as file:",
      files: [file],
    });
  } else {
    message.reply({ content: reply });
  }
};
