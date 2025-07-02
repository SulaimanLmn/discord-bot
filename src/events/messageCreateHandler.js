const geminiChatbot = require("../api/gemini");
const { AttachmentBuilder } = require("discord.js");

module.exports = (client) => {
  return async (message) => {
    if (message.author.bot) return;
    if (message.channel.id !== process.env.CHANNEL_ID) return;
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
  };
};
