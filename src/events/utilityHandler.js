const { MessageFlags } = require("discord.js");
const fs = require("fs");
const path = require("path");
const createInteraction = async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "love-percentage") {
    const percentage = Math.floor(Math.random() * 100) + 1;
    const user = interaction.user;
    const crush = interaction.options.getUser("your-crush");

    // Format time
    const now = new Date().toISOString().replace("T", " ").split(".")[0];

    // Create log message
    const logMessage = `[${now}] ${
      user.globalName || user.username
    } used /love-percentage on crush: ${crush.tag} → Result: ${percentage}%\n`;

    // Write to log file
    fs.writeFile(
      path.join(__dirname, "../log/log.txt"), // adjust path as needed
      logMessage,
      { flag: "a" },
      (err) => {
        if (err) console.error("Failed to write log:", err);
      }
    );

    return interaction.reply(`${crush} loves you ${percentage}% ❤️`);
  }
};

module.exports = {
  createInteraction,
};
