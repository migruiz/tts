

const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const TTS = require('./TTS')

const tts = TTS()

tts.startTTSProcesses();

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
  } catch {
  }
};

serialDataStream.on('data', onSerialData);


console.log("Started")


