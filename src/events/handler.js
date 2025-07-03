const creteInteractionHandler = require("./createInteractionHandler");
const messageCreateHandler = require("./messageCreateHandler");

module.exports = (client) => {
  try {
    client.on("ready", () => {
      console.log(`Login as a ${client.user.tag}`);
    });

    client.on("messageCreate", messageCreateHandler(client));

    client.on("interactionCreate", creteInteractionHandler);
  } catch (err) {
    throw err;
  }
};
