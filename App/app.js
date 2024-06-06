const { Observable, from, of } = require('rxjs');


const { map, shareReplay, startWith, filter, switchMap, distinctUntilChanged } = require('rxjs/operators');


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
const serialDataStream = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));


const onSerialData = (data) => {
  console.log('UART:', data);
};

serialDataStream.on('data', onSerialData);

const runPiper = (command, handlePiper) => {
  const piper = spawn(command, [], { shell: true });
  piper.stdin.setEncoding('utf8');
  piper.stderr.setEncoding('utf8');
  piper.stdout.setEncoding('utf8');


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

runPiper('/piper/process/piper --model /piper/model_EN.onnx --config /piper/config_EN.onnx.json --output-raw |   aplay -r 22050 -f S16_LE -t raw -',
  (piper, data) => {
    const {text, lg} = JSON.parse(data)
    if (lg==='EN' && text.length < 100) {
      piper.stdin.write(data + "\r\n")
    }
  }
);

runPiper('/piper/process/piper --model /piper/model_ES.onnx --config /piper/config_ES.onnx.json --output-raw |   aplay -r 22050 -f S16_LE -t raw -',
  (piper, data) => {
    const {text, lg} = JSON.parse(data)
    if (lg==='ES' && text.length < 100) {
      piper.stdin.write(data + "\r\n")
    }
  }
);


console.log("Started")


