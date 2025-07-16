const geminiChatbot = require("../api/gemini-chatbot");
const { AttachmentBuilder } = require("discord.js");
const {
  joinVoiceChannel,
  createAudioResource,
  createAudioPlayer,
  AudioPlayerStatus,
  StreamType,
} = require("@discordjs/voice");
const geminiTts = require("../api/gemini-tts");
const azureTts = require("../api/azure-tts");
const geminiGenerateImage = require("../api/gemini-image-generator");
const geminiImageRecognition = require("../api/gemini-image-recognition");
const { createFFmpegStream } = require("../utils/ffmpegStream");

module.exports = (client) => {
  return async (message) => {
    try {
      if (message.author.bot) return;
      await message.channel.sendTyping();
      // if (message.channel.id !== process.env.CHANNEL_ID) return;

      // Handle generated image
      if (message.content.startsWith("!generate")) {
        const prompt = message.content.replace("!generate", "").trim();
        const buffer = await geminiGenerateImage(prompt);
        const file = new AttachmentBuilder(buffer, { name: "image.png" });
        return message.reply({ files: [file] });
      }

      // Handle text to speech message
      if (message.content.startsWith("!tts")) {
        ttsHandler(message);
      }

      if (!message.mentions.has(client.user)) return;
      const prompt = message.content.replace(`<@${client.user.id}>`, "").trim();
      let attachment = message.attachments.first();
      const reference = message.reference;

      // Handle normal message
      if (!reference) return geminiChatbotHandler(message, prompt, attachment);

      const repliedMessage = await message.channel.messages.fetch(
        reference.messageId
      );

      // Handle replied message
      if (!repliedMessage.author.bot) {
        const repliedPrompt = repliedMessage.content + prompt;
        attachment = repliedMessage.attachments.first();

        return geminiChatbotHandler(message, repliedPrompt, attachment);
      }
    } catch (err) {
      message.reply(err);
    }
  };
};

const exceedCharacterLimitHandler = (message, reply) => {
  if (reply.length > 2000) {
    const buffer = Buffer.from(reply, "utf-8");
    const file = new AttachmentBuilder(buffer, { name: "response.txt" });
    message.reply({
      content: "Too long, sent as file:",
      files: [file],
    });
  } else {
    message.reply({ content: reply });
  }
};

const geminiChatbotHandler = async (message, prompt, attachment) => {
  try {
    if (attachment && attachment.size > 0) {
      const reply = await geminiImageRecognition(attachment.url, prompt);
      return exceedCharacterLimitHandler(message, reply);
    }

    const userId = message.author.id;
    const reply = await geminiChatbot(userId, prompt);
    return exceedCharacterLimitHandler(message, reply);
  } catch (err) {
    throw err;
  }
};

const ttsHandler = async (message) => {
  try {
    const prompt = message.content.replace("!tts", "").trim();
    const userChannel = message.member.voice.channel;
    if (!userChannel)
      return await message.reply(
        "You must join a VC first before using this command. Dumbass"
      );

    const userId = message.author.id;
    const result = await geminiChatbot(userId, prompt);

    const filePath = await azureTts(result);
    const ffmpegStream = createFFmpegStream(filePath);

    const connection = joinVoiceChannel({
      guildId: userChannel.guild.id,
      channelId: userChannel.id,
      adapterCreator: userChannel.guild.voiceAdapterCreator,
    });

    const player = createAudioPlayer();
    const resource = createAudioResource(ffmpegStream, {
      inputType: StreamType.Raw,
    });

    player.play(resource);
    connection.subscribe(player);

    player.once(AudioPlayerStatus.Idle, () => {
      connection.destroy();
    });

    return exceedCharacterLimitHandler(message, result);
  } catch (err) {
    console.error("TTS error:", err);
    await message.reply("An error occurred during TTS playback.");
  }
};
