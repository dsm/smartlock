const Users = require('../models/users').User;
const History = require('../models/users').History;
const serialPort = require('../serialport/comm').serialPort;
const login = 'loggin';
const logout = 'logout';
const maxHistoryCount = 10000;
var statDoor = false;
const timeOut = 5000;
const startupBuzzer = 200;
const buzzerTime = 100;
const UnknownUserBeep = 500;

var IO = (username, doorStatus) => {
    History
        .countDocuments()
        .then((count) => {
            console.log("Number of log file:", count);
            if (count >= maxHistoryCount) {
                deleteAccessHistory();
            }
            accessControl(username, doorStatus);
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

var accessControl = (username, doorStatus) => {
    Users.findOne({ 'username': username })
        .then((user) => {
            // Username does not exist, log the error and redirect back
            if (!user) {
                console.log("User Not Found with this : ", username);
                //saveUnknownUser(username);
            }
            else {
                if (doorStatus) {
                    console.log("Welcome to our land : ", user.username);
                    saveHistory(user, login);
                    OpenTheDoor(doorStatus);
                }
                else {
                    console.log("Good Bye to our land : ", user.username);
                    saveHistory(user, logout);
                    CloseTheDoor(doorStatus);
                }
            }
        })
        .catch(err => {
            console.log(err)
        });
};

var OpenTheDoor = (doorStatus) => {
    console.log("The door is opening and door status is : ", doorStatus);
    openKey = Buffer.from([0x43, 0x19]);

    serialPort.write(openKey, err => {
        if (err) {
            return console.log('Error on write: ', err.message)
        }
        console.log('message written')
    })
}

var CloseTheDoor = (doorStatus) => {
    console.log("The door is closing and door status is : ", doorStatus);
    closeKey = Buffer.from([0x43, 0x51]);

    serialPort.write(closeKey, err => {
        if (err) {
            return console.log('Error on write: ', err.message)
        }
        console.log('message written')
    })
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

/* 
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
 */
/* 
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
}; */

module.exports.openTheDoor = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.redirect('/login')
    } else {
        statDoor = true;
        IO(req.user.username, statDoor)
        res.render('home',
            {
                admin: req.user.admin,
                userAuth: req.isAuthenticated(),
                doorStatus: statDoor,
            });
    }
};

module.exports.closeTheDoor = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.redirect('/login')
    } else {
        statDoor = false;
        IO(req.user.username, statDoor)
        res.render('home',
            {
                admin: req.user.admin,
                userAuth: req.isAuthenticated(),
                doorStatus: statDoor,
            });
    }
};

module.exports.home = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.redirect('/login')
    } else {
        res.render('home',
            {
                admin: req.user.admin,
                userAuth: req.isAuthenticated(),
                doorStatus: undefined,
            });
        next();
    }
};