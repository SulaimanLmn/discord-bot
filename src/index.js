const { Client, IntentsBitField, REST, Routes } = require("discord.js");

const orderCommand = require("./commands/utility/order");
const commandHandler = require("./events/handler");
const lovePercentageCommand = require("./commands/utility/lovePercentage");
const optionTestCommand = require("./commands//fun/optionTest");
const joinVcCommand = require("./commands/fun/join");
const geminiCommand = require("./commands/fun/gemini");

require("dotenv").config();
const { TOKEN, CLIENT_ID, GUILD_ID } = process.env;

const commands = [
  orderCommand,
  lovePercentageCommand,
  optionTestCommand,
  joinVcCommand,
  geminiCommand,
];
const client = new Client({
  intents: [
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildVoiceStates,
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
    commandHandler(client);
  } catch (err) {
    console.log(`Commands register failed:`);
  }
})();
