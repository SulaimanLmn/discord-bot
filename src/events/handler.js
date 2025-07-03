const creteInteractionHandler = require("./createInteractionHandler");
const { Client, AttachmentBuilder } = require("discord.js");
const geminiChatbot = require("../api/gemini");
const messageCreateHandler = require("./messageCreateHandler");

module.exports = (client) => {
  try {
    client.on("ready", () => {
      console.log(`Login as a ${client.user.tag}`);
    });

    client.on("messageCreate", messageCreateHandler(client));

    client.on("interactionCreate", creteInteractionHandler);
  } catch (err) {
    throw err;
  }
};
