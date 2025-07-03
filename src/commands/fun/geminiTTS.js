const { SlashCommandBuilder, ChannelType } = require("discord.js");

module.exports = new SlashCommandBuilder()
  .setName("text-to-speech")
  .setDescription(
    "it will say outloud whatever answer you got (might take a while though and only 15 request per day)"
  )
  .addChannelOption((channel) =>
    channel
      .setName("vc")
      .setDescription("Pick one vc")
      .setRequired(true)
      .addChannelTypes(ChannelType.GuildVoice)
  )
  .addStringOption((option) =>
    option.setName("prompt").setDescription("Your question").setRequired(true)
  );
