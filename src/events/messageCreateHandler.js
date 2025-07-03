const geminiChatbot = require("../api/gemini");
const { AttachmentBuilder } = require("discord.js");
const geminiGenerateImage = require("../api/gemini-generated");

module.exports = (client) => {
  return async (message) => {
    try {
      if (message.author.bot) return;
      if (message.channel.id !== process.env.CHANNEL_ID) return;
      if (message.content.startsWith("!generate")) {
        const prompt = message.content.replace("!generate", "").trim();
        console.log(prompt);
        await message.channel.sendTyping();
        const buffer = await geminiGenerateImage(prompt);
        const file = new AttachmentBuilder(buffer, { name: "image.png" });
        message.reply({ files: [file] });
      }
      if (!message.mentions.has(client.user)) return;

      const prompt = message.content.replace(`<@${client.user.id}>`, "").trim();
      if (!prompt) return;

      await message.channel.sendTyping();

      const userId = message.author.id;
      const reply = await geminiChatbot(userId, prompt);

      if (reply.length > 2000) {
        const buffer = Buffer.from(reply, "utf-8");
        const file = new AttachmentBuilder(buffer, { name: "response.txt" });
        message.reply({ content: "Too long, sent as file:", files: [file] });
      } else {
        message.reply({ content: reply });
      }
    } catch (err) {
      message.reply("Udah bang kena limit");
    }
  };
};
