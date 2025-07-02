const creteInteractionHandler = require("./createInteractionHandler");
const { Client } = require("discord.js");
const geminiChatbot = require("../api/gemini");

module.exports = (client) => {
  try {
    client.on("ready", () => {
      console.log(`Login as a ${client.user.tag}`);
    });

    client.on("messageCreate", async (message) => {
      if (message.author.bot) return;
      const prompt = message.content;
      const conversationLog = [];
      const prevMessages = await message.channel.messages.fetch({ limit: 15 });
      prevMessages.reverse();

      prevMessages.forEach((msg) => {
        if (msg.author.id !== client.user.id && message.author.bot) return;
        if (msg.author.id !== message.author.id) return;
        conversationLog.push({
          role: "user",
          parts: [{ text: prompt }],
        });
      });
      const res = await geminiChatbot(conversationLog, prompt);
      return message.reply(res);
    });

    client.on("interactionCreate", creteInteractionHandler);

    client.on("channelCreate", (channel) => {
      console.log(`Channel with name ${channel.name} created`);
    });
  } catch (err) {
    throw err;
  }
};
