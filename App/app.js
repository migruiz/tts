

const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const TTS = require('./TTS')
const SoundSelector = require('./SoundSelector')

const tts = TTS()
tts.startTTSProcesses();

const soundSelector = SoundSelector();

var port = new SerialPort({
  path: '/dev/ttyS0',
  baudRate: 9600,
  dataBits: 8,
  parity: 'none',
  flowControl: false
});
const serialDataStream = port.pipe(new ReadlineParser({ delimiter: '\r\n', encoding: "latin1" }));


const onSerialData = (data) => {
  console.log('UART: ', data);
  try {
    const robotData = JSON.parse(data)
    if (robotData.type === 'TTS') {
      tts.handleTTSMessage(robotData)
    }
    if (robotData.type === 'PLAY_SOUND' || robotData.type === 'STOP_ALL_SOUNDS') {
      soundSelector.handleSoundMessage(robotData)
    }
    if (robotData.type==='Init'){
      soundSelector.stopAllSounds();
    }
  } catch {
  }
};

serialDataStream.on('data', onSerialData);

port.on('error', function(err) {
  console.log(err);
})

port.on('close', function(err) {
  console.log(err);
});


console.log("Started")


