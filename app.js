var expressSession = require('express-session'),
    initPassport = require('./app_server/passport/init');
const express = require('express'),
    http1_port = 80,
    path = require('path'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    app = express(),
    db = require('./app_server/models/db'),
    //rfid = require('./app_server/rfid/rfid'),
    routerManager = require('./app_server/routes/routerManager'),
    flash = require('connect-flash'),
    passport = require('passport'),
    ejsLayout = require('express-ejs-layouts'),
    serialPort = require('./app_server/serialport/comm').serialPort;



/*----------------------------------------------*/

/*var Gpio = require('rpio');
const OUTPUT = Gpio.OUTPUT;
const INPUT = Gpio.INPUT;
const HIGH = Gpio.HIGH;
const LOW = Gpio.LOW;

var pinMode = (pin, mode) => { Gpio.open(pin, mode, LOW); }
var digitalWrite = (pin, value) => { Gpio.write(pin, value); }

const motoren = 15;
const motor1 = 3;
const motor2 = 5;
const buzzerPin = 10;

pinMode(motor1, OUTPUT);
pinMode(motor2, OUTPUT);
pinMode(buzzerPin, OUTPUT);
pinMode(motoren, OUTPUT);

digitalWrite(motor1, HIGH);
digitalWrite(motor2, LOW);*/

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/app_server/views'))
app.use(ejsLayout)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: 'false' }))
app.use(cookieParser())

app.use('/public', express.static(path.join(__dirname, 'public')))

app.use(expressSession({
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: true,
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())


initPassport(passport)

routerManager(app)

app.listen(http1_port, () => {
    startupKey = Buffer.from([0x43, 0x34]);

    serialPort.write(startupKey, err => {
        if (err) {
            return console.log('Error on write: ', err.message)
        }
        console.log('message written')
    })

    console.log('Listening http server on port: ' + http1_port)
});

process.on('SIGINT', function () {
    console.log("\nCaught interrupt signal");
    //digitalWrite(motor1, LOW);
    //digitalWrite(motor2, LOW);
    process.exit();
});
