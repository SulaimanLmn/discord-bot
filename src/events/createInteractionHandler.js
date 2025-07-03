const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  StreamType,
} = require("@discordjs/voice");
const fs = require("fs");
const path = require("path");
const { MessageFlags, AttachmentBuilder, messageLink } = require("discord.js");
const geminiChatbot = require("../api/gemini-chatbot");
const geminiTts = require("../api/gemini-tts");
const { Readable } = require("stream");

module.exports = async (interaction) => {
  try {
    if (!interaction.isChatInputCommand()) return;

    // if (interaction.commandName === "chatbot")
    //   return await chatbotHandler(interaction);

    if (interaction.commandName === "text-to-speech") {
      ttsChatbotHandler(interaction);
    }
    if (interaction.commandName === "soundboards")
      return soundboardHandler(interaction);

    if (interaction.commandName === "love-percentage")
      return lovePercentageHandler(interaction);
  } catch (err) {
    return interaction.reply(err);
  }
};

const chatbotHandler = async (interaction) => {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

  try {
    const prompt = interaction.options.getString("prompt");

    const res = await geminiChatbot(undefined, prompt);

    if (res.length > 2000) {
      const buffer = Buffer.from(res, "utf-8");
      const file = new AttachmentBuilder(buffer, { name: "response.txt" });

      await interaction.editReply({
        content: "Response too long, sent as a file instead.",
        files: [file],
      });
    } else {
      await interaction.editReply({
        content: res,
      });
    }
  } catch (err) {
    console.error("chatbot error:", err);
    if (interaction.deferred && !interaction.replied) {
      await interaction.editReply({
        content: "Something went wrong while generating your response.",
      });
    }
  }
};

const soundboardHandler = async (interaction) => {
  try {
    const voiceConnection = joinVoiceChannel({
      guildId: interaction.guildId,
      channelId: interaction.options.getChannel("vc").id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });
    const soundboard = interaction.options.getString("soundboard");
    const player = createAudioPlayer();
    const audioPath = path.join(__dirname, `../sounds/${soundboard}.mp3`);
    const resource = createAudioResource(audioPath);
    player.play(resource);
    voiceConnection.subscribe(player);

    player.on(AudioPlayerStatus.Idle, () => {
      voiceConnection.destroy();
    });

    interaction.reply({
      content: "Audio finish playing",
      flags: MessageFlags.Ephemeral,
    });
  } catch (err) {
    console.log(`join vc error ${err}`);
  }
};

const lovePercentageHandler = async () => {
  try {
    const percentage = Math.floor(Math.random() * 100) + 1;
    const user = interaction.user;
    const crush = interaction.options.getUser("your-crush");

    const now = new Date().toISOString().replace("T", " ").split(".")[0];

    const logMessage = `[${now}] ${
      user.globalName || user.username
    } used /love-percentage on crush: ${crush.tag} → Result: ${percentage}%\n`;

    fs.writeFile(
      path.join(__dirname, "../log/log.txt"),
      logMessage,
      { flag: "a" },
      (err) => {
        if (err) console.error("Failed to write log:", err);
      }
    );

    interaction.reply(`${crush} loves you ${percentage}% ❤️`);
  } catch (err) {
    console.log(`love percentage error ${err}`);
  }
};

const ttsChatbotHandler = async (interaction) => {
  const prompt = interaction.options.getString("prompt");
  const vc = interaction.options.getChannel("vc");
  const userId = interaction.user.id;

  await interaction.deferReply();

  try {
    const result = await geminiChatbot(userId, prompt);
    const wavStream = await geminiTts(result);

    await interaction.editReply(result);

    const connection = joinVoiceChannel({
      guildId: interaction.guild.id,
      channelId: vc.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    const resource = createAudioResource(wavStream, {
      inputType: StreamType.Arbitrary,
    });

    const player = createAudioPlayer();
    player.play(resource);
    connection.subscribe(player);

    player.on(AudioPlayerStatus.Idle, () => {
      connection.destroy();
    });
  } catch (err) {
    console.error("TTS error:", err);
    await interaction.editReply({
      content: "Bang udah bang. Kena limit",
      flags: MessageFlags.Ephemeral,
    });
  }
};
