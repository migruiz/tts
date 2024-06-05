const { Observable, from, of } = require('rxjs');


const { map, shareReplay, startWith, filter, switchMap, distinctUntilChanged } = require('rxjs/operators');


const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
var spawn = require('child_process').spawn;
const piper = spawn('/piper/process/piper --model /piper/model.onnx --config /piper/config.onnx.json --output-raw |   aplay -r 22050 -f S16_LE -t raw -', [], { shell: true });
piper.stdin.setEncoding('utf8');
piper.stderr.setEncoding('utf8');
piper.stdout.setEncoding('utf8');

var port = new SerialPort({
  path: '/dev/ttyS0',
  baudRate: 9600,
  dataBits: 8,
  parity: 'none',
  flowControl: false
});
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));


parser.on('data', (data) => {

  piper.stdin.write(data + "\r\n")
  console.log('Received data from UART:', data);
});
piper.stdout.on('data', (data) => {
  console.log(data);
});
piper.stderr.on('data', (data) => {
  console.log(data);
});
piper.on('close', (code) => {
  console.log(`child process close all stdio with code ${code}`);
});

piper.on('exit', (code) => {
  console.log(`child process exited with code ${code}`);
}); 

console.log("Started")


