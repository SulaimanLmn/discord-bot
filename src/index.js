const { Client, IntentsBitField, REST, Routes } = require("discord.js");

const orderCommand = require("./commands/utility/order");
const commandHandler = require("./events/handler");
const lovePercentageCommand = require("./commands/utility/lovePercentage");
const UtilityHandler = require("./events/utilityHandler");

require("dotenv").config();
const { TOKEN, CLIENT_ID, GUILD_ID } = process.env;

const commands = [orderCommand, lovePercentageCommand];
const client = new Client({
  intents: [
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.Guilds,
  ],
});

(async () => {
  try {
    const rest = new REST({ version: 10 }).setToken(TOKEN);
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: commands,
    });
    console.log("Commands register Success");

    client.login(TOKEN);
  } catch (err) {
    console.log(`Commands register failed: ${err}`);
  }
})();

commandHandler(client);
