/*----------------------------------------------*/
var Gpio = require('rpio');
const OUTPUT = Gpio.OUTPUT;
const INPUT = Gpio.INPUT;
const HIGH = Gpio.HIGH;
const LOW = Gpio.LOW;
//Gpio.init({mapping: 'gpio'});
var pinMode = (pin, mode) => { Gpio.open(pin, mode, LOW); }
var digitalWrite = (pin, value) => { Gpio.write(pin, value); }

const motoren = 15;
const motor1 = 11;
const motor2 = 12;
const buzzerPin = 10;

pinMode(motor1, OUTPUT);
pinMode(motor2, OUTPUT);
pinMode(buzzerPin, OUTPUT);
pinMode(motoren, OUTPUT);

var startup = true;

/*----------------------------------------------*/

/*----------------------------------------------*/
const io = require('socket.io')(8500);
const rc522 = require('rc522');
const Users = require('../models/users').User;
const History = require('../models/users').History;
const login = 'loggin';
const logout = 'logout';
var doorStatus = false;
const maxHistoryCount = 10000;
const timeOut = 5000;
const startupBuzzer = 200;
const buzzerTime = 100;
const UnknownUserBeep = 500;
var openingInterval,
    closingInterval,
    openingTimeout,
    closingTimeout;
/*----------------------------------------------*/

console.log('Ready!!!', Date());

const pio = require('onoff').Gpio;
const button = new pio(27, 'in', 'rising',{debounceTimeout: 100});
 
button.watch((err, value) => {
    clearInterval(openingInterval);
    clearInterval(closingInterval);
    clearTimeout(openingTimeout);
    clearTimeout(closingTimeout);
    if (doorStatus) {
        buzzer_beep();
        saveButtonHistory(login);
        OpenTheDoor();
    }
    else {
        buzzer_beep();
        saveButtonHistory(logout);
        CloseTheDoor();
    }
    console.log(value);
});



if(startup){
    buzzer_beep(startupBuzzer);
    startup = false;
}


rc522((cardid) => {
    clearInterval(openingInterval);
    clearInterval(closingInterval);
    clearTimeout(openingTimeout);
    clearTimeout(closingTimeout);
    io.sockets.emit('rfid', cardid);
    IO(cardid);
});


var IO = (cardid) => {
    History
        .count()
        .then((count) => {
            console.log("Number of log file:", count);
            if (count >= maxHistoryCount) {
                deleteAccessHistory();
            }
            accessControl(cardid);
        })
        .catch(err => {
            console.log(err)
        });
};

var deleteAccessHistory = () => {
    History
        .remove()
        .then(() => {
            console.log('History cleaned up');
        })
        .catch(err => {
            console.log(err);
        });
};


var accessControl = (cardid) => {
    Users.findOne({ 'cardid': cardid })
        .then((user) => {
            // Username does not exist, log the error and redirect back
            if (!user) {
                console.log("User Not Found with this : ", cardid);
                buzzer_beep(UnknownUserBeep);
                saveUnknownUser(cardid);
            }
            else {
                if (doorStatus) {
                    console.log("Welcome to our land : ", user.username, ": ", cardid);
                    buzzer_beep(buzzerTime);
                    saveHistory(user, login);
                    OpenTheDoor();
                }
                else {
                    console.log("Good Bye to our land : ", user.username, ": ", cardid);
                    buzzer_beep(buzzerTime);
                    saveHistory(user, logout);
                    CloseTheDoor();
                }
            }
        })
        .catch(err => {
            console.log(err)
        });
};

var OpenTheDoor = () => {
    doorStatus = false;
    console.log("The door is opening and door status is : ", doorStatus);

    openingInterval = setInterval(() => {
        digitalWrite(motoren, HIGH);
        digitalWrite(motor1, HIGH);
        digitalWrite(motor2, LOW);
    });

    openingTimeout = setTimeout(() => {
        clearInterval(openingInterval);
        closingInterval = setInterval(() => {
            digitalWrite(motoren, HIGH);
            digitalWrite(motor1, LOW);
            digitalWrite(motor2, HIGH);
        });
        closingTimeout = setTimeout(() => {
            clearInterval(closingInterval);
            digitalWrite(motoren, LOW);
            digitalWrite(motor1, LOW);
            digitalWrite(motor2, LOW);
        }, 100);
    }, timeOut);
}

var CloseTheDoor = () => {
    doorStatus = true;
    console.log("The door is closing and door status is : ", doorStatus);

    closingInterval = setInterval(() => {
        digitalWrite(motoren, HIGH);
        digitalWrite(motor1, LOW);
        digitalWrite(motor2, HIGH);
    });

    closingTimeout = setTimeout(() => {
        clearInterval(closingInterval);
        digitalWrite(motoren, LOW);
        digitalWrite(motor1, LOW);
        digitalWrite(motor2, LOW);
    }, timeOut);
}

var saveHistory = (user, status) => {

    var params = {
        name: user.name,
        surname: user.surname,
        cardid: user.cardid,
        date: Date(),
        status: status
    };
    new History(params)
        .save()
        .then(() => {
            console.log('Log succesful');
        })
        .catch(err => {
            console.log('Log unsuccesful: ' + err);
        });
};


var saveUnknownUser = (cardid) => {

    var params = {
        name: 'Unknown',
        surname: 'Unknown',
        cardid: cardid,
        date: Date(),
        status: 'No Access'
    };

    new History(params)
        .save()
        .then(() => {
            console.log('Log succesful');
        })
        .catch(err => {
            console.log('Log unsuccesful: ' + err);
        });
};

var saveButtonHistory = (status) => {

    var params = {
        name: 'button',
        surname: 'button',
        cardid: 'button',
        date: Date(),
        status: status
    };
    new History(params)
        .save()
        .then(() => {
            console.log('Log succesful');
        })
        .catch(err => {
            console.log('Log unsuccesful: ' + err);
        });
};



function buzzer_beep(time){

    var buzzerInterval = setInterval(() => {
        digitalWrite(buzzerPin, HIGH);
    });

    setTimeout(() => {
        clearInterval(buzzerInterval);
        digitalWrite(buzzerPin, LOW);
    }, time);

};
