const { SlashCommandBuilder } = require("discord.js");

module.exports = new SlashCommandBuilder()
  .setName("love-percentage")
  .setDescription(
    "Tell how much love percentage of someone in this server love you"
  )
  .addUserOption((option) =>
    option
      .setName("your-crush")
      .setDescription("Your crush name")
      .setRequired(true)
  )
  .toJSON();
