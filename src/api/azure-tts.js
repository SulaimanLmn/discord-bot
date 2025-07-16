const sdk = require("microsoft-cognitiveservices-speech-sdk");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const { AZURE_KEY, AZURE_REGION } = process.env;

module.exports = async function azureTts(text) {
  return new Promise((resolve, reject) => {
    const outputDir = path.join(__dirname, "../tts-output");
    const outputPath = path.join(outputDir, "tts-output.wav");

    fs.mkdirSync(outputDir, { recursive: true });

    const speechConfig = sdk.SpeechConfig.fromSubscription(
      AZURE_KEY,
      AZURE_REGION
    );
    speechConfig.speechSynthesisVoiceName = "en-US-AshleyNeural";
    const audioConfig = sdk.AudioConfig.fromAudioFileOutput(outputPath);
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

    const ssml = `
         <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis"
           xmlns:mstts="http://www.w3.org/2001/mstts"
           xml:lang="en-US">
      <voice name="en-US-AshleyNeural">
        <mstts:express-as style="unfriendly" role="Girl">
          <prosody pitch="+23%" contour="(0%, +0%) (100%, +0%)">
           ${text}
          </prosody>
        </mstts:express-as>
      </voice>
    </speak>
    `;

    // untouch
    //      <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis"
    //        xmlns:mstts="http://www.w3.org/2001/mstts"
    //        xml:lang="en-US">
    //   <voice name="en-US-AshleyNeural">
    //     <mstts:express-as style="angry" styledegree="1.2">
    //       <prosody pitch="+23%" contour="(0%, +0%) (100%, +0%)">
    //         <say-as interpret-as="verbatim">${text}</say-as>
    //       </prosody>
    //     </mstts:express-as>
    //   </voice>
    // </speak>

    synthesizer.speakSsmlAsync(
      ssml,
      () => {
        synthesizer.close();
        resolve(outputPath);
      },
      (err) => {
        synthesizer.close();
        reject(err);
      }
    );
  });
};
