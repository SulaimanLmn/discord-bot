const { SlashCommandBuilder } = require("discord.js");

module.exports = new SlashCommandBuilder()
  .setName("order")
  .setDescription("Making an order")
  .addStringOption((option) =>
    option
      .setName("your-order")
      .setDescription("Set order")
      .setRequired(true)
      .addChoices([
        {
          name: "Hamburger",
          value: "Hamburger",
        },
      ])
  )
  .toJSON();
