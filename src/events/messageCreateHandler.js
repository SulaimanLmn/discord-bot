const geminiChatbot = require("../api/gemini-chatbot");
const { AttachmentBuilder } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");
const geminiTts = require("../api/gemini-tts");
const geminiGenerateImage = require("../api/gemini-image-generator");
const geminiImageRecognition = require("../api/gemini-image-recognition");

module.exports = (client) => {
  return async (message) => {
    try {
      if (message.author.bot) return;
      // if (message.channel.id !== process.env.CHANNEL_ID) return;
      if (message.content.startsWith("!generate")) {
        const prompt = message.content.replace("!generate", "").trim();
        await message.channel.sendTyping();
        const buffer = await geminiGenerateImage(prompt);
        const file = new AttachmentBuilder(buffer, { name: "image.png" });
        return message.reply({ files: [file] });
      }

      if (message.content.startsWith("!tts")) {
        const prompt = message.content.replace("!tts", "").trim();
        console.log(prompt);
        const userChannel = message.member.voice.channel;
        if (!userChannel)
          return await message.reply(
            "You must join a VC first before using this command. Dumbass"
          );
        const userId = message.author.id;
        console.log(userId);

        await message.channel.sendTyping();

        try {
          const result = await geminiChatbot(userId, prompt);
          // const wavStream = await geminiTts(result);

          const connection = joinVoiceChannel({
            guildId: userChannel.guild.id,
            channelId: userChannel.id,
            adapterCreator: userChannel.guild.voiceAdapterCreator,
          });

          // const resource = createAudioResource(wavStream, {
          //   inputType: StreamType.Arbitrary,
          // });

          // const player = createAudioPlayer();
          // player.play(resource);
          // connection.subscribe(player);

          // player.on(AudioPlayerStatus.Idle, () => {
          //   connection.destroy();
          // });
          return exceedCharacterLimitHandler(message, result);
        } catch (err) {
          console.log(err);
          await message.reply("Bang udah bang. Kena limit");
        }
      }
      if (!message.mentions.has(client.user)) return;

      const prompt = message.content.replace(`<@${client.user.id}>`, "").trim();
      if (!prompt) return;

      await message.channel.sendTyping();

      const attachment = message.attachments.first();
      if (attachment && attachment.size > 0) {
        console.log(message.url);
        const reply = await geminiImageRecognition(attachment.url, prompt);
        return exceedCharacterLimitHandler(message, reply);
      }

      const userId = message.author.id;
      const reply = await geminiChatbot(userId, prompt);
      return exceedCharacterLimitHandler(message, reply);
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
