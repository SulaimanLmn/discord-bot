const { SlashCommandBuilder } = require("discord.js");
module.exports = new SlashCommandBuilder()
  .setName("chatbot")
  .setDescription("ask anything to chatbot")
  .addStringOption((option) =>
    option.setName("prompt").setDescription("Your question").setRequired(true)
  );
