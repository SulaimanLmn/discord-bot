const UtilityHandler = require("./utilityHandler");
module.exports = (client) => {
  client.on("ready", (client) => {
    console.log(`Login as a ${client.user.tag}`);
  });

  client.on("interactionCreate", UtilityHandler.createInteraction);

  client.on("messageCreate", (message) => {
    if (message.author.bot) return;

    message.reply("Helz");
  });

  client.on("channelCreate", (channel) => {
    console.log(`Channel with name ${channel.name} created`);
  });
};
