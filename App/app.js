

const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
var spawn = require('child_process').spawn;


var port = new SerialPort({
  path: '/dev/ttyS0',
  baudRate: 9600,
  dataBits: 8,
  parity: 'none',
  flowControl: false
});
const serialDataStream = port.pipe(new ReadlineParser({ delimiter: '\r\n', encoding:"latin1" }));


const onSerialData = (data) => {
  console.log('UART: ', data);
};

serialDataStream.on('data', onSerialData);

const runPiper = (command, handlePiper) => {
  const piper = spawn(command, [], { shell: true });
  piper.stdin.setEncoding('latin1');
  piper.stderr.setEncoding('latin1');
  piper.stdout.setEncoding('latin1');


  const onSerialData = (data) => {
    handlePiper(piper, data)
  };

  serialDataStream.on('data', onSerialData);

  piper.stdout.on('data', (data) => {
    console.log(`O-${piper.pid}: ${data}`);
  });
  piper.stderr.on('data', (data) => {
    console.log(`E-${piper.pid}: ${data}`);
  });
  piper.on('close', (code) => {
    console.log(`process ${piper.pid} closed with code ${code}`);
    serialDataStream.removeListener('data', onSerialData)
    setTimeout(() => {
      piper.removeAllListeners()
    }, 1)
    runPiper(command)
  });

  piper.on('exit', (code) => {
    console.log(`process ${piper.pid} exited with code ${code}`);
  });

}

const processPiperOnSerialData = (language, piper, serialData) => {
  let text, lg
  try {
    const ttsData = JSON.parse(serialData)
    text = ttsData.text
    lg = ttsData.lg
  } catch {
    return
  }

  if (lg && text && lg === language && text.length > 0 && text.length < 100) {
    piper.stdin.write(text + "\r\n")
  }
}

runPiper('/piper/process/piper --model /piper/model_EN.onnx --config /piper/config_EN.onnx.json --output-raw |   aplay -r 22050 -f S16_LE -t raw -',
  (piper, serialData) => {
    processPiperOnSerialData("EN", piper, serialData)
  }
);

runPiper('/piper/process/piper --model /piper/model_ES.onnx --config /piper/config_ES.onnx.json --output-raw |   aplay -r 22050 -f S16_LE -t raw -',
  (piper, serialData) => {
    processPiperOnSerialData("ES", piper, serialData)
  }
);


console.log("Started")


