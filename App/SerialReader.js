

const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const SerialReader = (onRobotData) => {

    const initNewPort = () => {
        const port = new SerialPort({
            path: '/dev/ttyS0',
            baudRate: 9600,
            dataBits: 8,
            parity: 'none',
            flowControl: false
        });
        const serialDataStream = port.pipe(new ReadlineParser({ delimiter: '\r\n', encoding: "latin1" }));

        port.on('error', function (err) {
            console.log(`err + ${err}`);
        })

        port.on('close', function (err) {
            console.log(`close ${err}`);
            setTimeout(() => {
                //port.removeAllListeners()
                //serialDataStream.removeAllListeners()
                initNewPort()
            }, 1)
        });

        const onSerialData = (data) => {
            console.log('UART: ', data);
            try {
                const robotData = JSON.parse(data)
                onRobotData(robotData)
            } catch {
            }
        };

        serialDataStream.on('data', onSerialData);


    }

    const startReading = () => {
        initNewPort()
    }


    return {
        startReading
    }
}

module.exports = SerialReader