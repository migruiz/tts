
const TTS = require('./TTS')
const SoundSelector = require('./SoundSelector')
const SerialReader = require('./SerialReader')

const tts = TTS()
tts.startTTSProcesses();

const soundSelector = SoundSelector();


const onRobotSerialData = (robotData) => {
  if (robotData.type === 'TTS') {
    tts.handleTTSMessage(robotData)
  }
  if (robotData.type === 'PLAY_SOUND' || robotData.type === 'STOP_ALL_SOUNDS') {
    soundSelector.handleSoundMessage(robotData)
  }
  if (robotData.type === 'Init') {
    soundSelector.stopAllSounds();
  }
}
const serialReader = SerialReader(onRobotSerialData)
serialReader.startReading();

console.log("Started")


