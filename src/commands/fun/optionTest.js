const { SlashCommandBuilder } = require("discord.js");

module.exports = new SlashCommandBuilder()
  .setName("all-option")
  .setDescription("check all available option")
  .addRoleOption((option) =>
    option.setName("role-option").setDescription("role option")
  )
  .addAttachmentOption((option) =>
    option.setName("attachment").setDescription("attachment")
  )
  .addMentionableOption((option) =>
    option.setName("mentionable").setDescription("mentionable")
  );
