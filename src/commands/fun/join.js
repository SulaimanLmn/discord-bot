const { SlashCommandBuilder, ChannelType } = require("discord.js");

module.exports = new SlashCommandBuilder()
  .setName("join-vc")
  .setDescription("Make the bot joining vc")
  .addChannelOption((channel) =>
    channel
      .setName("vc-name")
      .setDescription("Pick vc you want the bot to join")
      .setRequired(true)
      .addChannelTypes(ChannelType.GuildVoice)
  )
  .addStringOption((option) =>
    option
      .setName("soundboard")
      .setDescription("Pick one of these soundboard to play")
      .addChoices([
        {
          name: "Vine boom",
          value: "vine-boom",
        },
        {
          name: "Bomboclat",
          value: "bomboclat",
        },
      ])
      .setRequired(true)
  );
