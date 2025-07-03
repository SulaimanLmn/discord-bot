const { SlashCommandBuilder, ChannelType } = require("discord.js");

module.exports = new SlashCommandBuilder()
  .setName("soundboards")
  .setDescription("Make the bot joining vc and play a fucking soundboard")
  .addChannelOption((channel) =>
    channel
      .setName("vc")
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
        {
          name: "Kobo Jawa",
          value: "kobo-jawa",
        },
        {
          name: "Tuco get out cut off",
          value: "tuco-get-out-cut-off",
        },
        {
          name: "Patrick pembohong",
          value: "patrick-pembohong",
        },
        {
          name: "Hidup blonde",
          value: "hidup-blonde",
        },
        {
          name: "Bang kapan mainnya bang",
          value: "bang-kapan-mainnya",
        },
        {
          name: "Samlekom ireng",
          value: "samlekom-ireng",
        },
      ])
      .setRequired(true)
  );
