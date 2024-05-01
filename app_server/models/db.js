
const mongoose = require('mongoose')

const url = 'mongodb://localhost:27017/test';

const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0,
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    useUnifiedTopology: true
};

mongoose.connect(url, options)
    .then(() => {
        console.log("mongoose connected : " + url);
    })
    .catch(err => {
        console.log("mongoose isn't connected : " + err);
    }
    );
