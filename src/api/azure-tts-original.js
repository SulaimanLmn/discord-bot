const sdk = require("microsoft-cognitiveservices-speech-sdk");

// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

// pull in the required packages.

const readline = require("readline");
require("dotenv").config();
// replace with your own subscription key,
// service region (e.g., "westus"), and
// the name of the file you save the synthesized audio.

// we are done with the setup

// now create the audio-config pointing to our stream and
// the speech config specifying the language.
const { AZURE_KEY, AZURE_REGION } = process.env;
var audioConfig = sdk.AudioConfig.fromAudioFileOutput("test-tts.wav");
var speechConfig = sdk.SpeechConfig.fromSubscription(AZURE_KEY, AZURE_REGION);
speechConfig.speechSynthesisVoiceName = "en-US-AshleyNeural";

// create the speech synthesizer.
var synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Type some text that you want to speak...\n> ", function (text) {
  rl.close();

  const ssml = `
    <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis"
           xmlns:mstts="http://www.w3.org/2001/mstts"
           xml:lang="en-US">
      <voice name="en-US-AshleyNeural">
        <prosody pitch="+25%">
          ${text}
        </prosody>
      </voice>
    </speak>
  `;

  synthesizer.speakSsmlAsync(
    ssml,
    function (result) {
      if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
        console.log("Synthesis finished.");
      } else {
        console.error("Speech synthesis canceled: " + result.errorDetails);
      }
      synthesizer.close();
    },
    function (err) {
      console.trace("Error - " + err);
      synthesizer.close();
    }
  );

  console.log("Now synthesizing with pitch +35% to: " + filename);
});
