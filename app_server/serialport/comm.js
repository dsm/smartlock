const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const serialPort1 = new SerialPort('/dev/serial0', { baudRate: 115200 }, err => {
    if (err) {
        return console.log('Error: ', err.message)
    }
});
//const parser = port.pipe(new Readline({ delimiter: '\n' }));// Read the port data

serialPort1.on("open", () => {
    console.log('Serial port open.')
})

module.exports.serialPort = serialPort1;
