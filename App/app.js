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

const runPiper = (command) => {
  const piper = spawn(command, [], { shell: true });
  piper.stdin.setEncoding('utf8');
  piper.stderr.setEncoding('utf8');
  piper.stdout.setEncoding('utf8');


  const onSerialData = (data) => {
    console.log('UART:', data);
    if (data.length < 100) {
      piper.stdin.write(data + "\r\n")
    }
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

runPiper('/piper/process/piper --model /piper/model.onnx --config /piper/config.onnx.json --output-raw |   aplay -r 22050 -f S16_LE -t raw -');


console.log("Started")


