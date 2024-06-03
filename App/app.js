const { Observable, from, of } = require('rxjs');

const {  map,shareReplay,startWith, filter,switchMap, distinctUntilChanged} = require('rxjs/operators');


const { SerialPort } = require('serialport');
const {ReadlineParser } = require('@serialport/parser-readline');


var port  = new SerialPort({
    path: '/dev/ttyS0',
    baudRate:9600,
    dataBits:8,
    parity: 'none',
    flowControl: false
});
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));


// Start listening to UART data
parser.on('open', function(data) {
    console.log('Serial port is open');
    parser.on('data', (data) => {
      console.log('Received data from UART:', data);
    });
  });


console.log("Started")


