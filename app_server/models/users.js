const mongoose = require('mongoose');
var bCrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;
const createAdmin = true;
const userSchema = new Schema(
    {
        admin: {
            type: Boolean,
        },
        name: {
            type: String,
            required: true
        },
        surname: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: false
        },
        cardid: {
            type: String,
            required: true,
            unique: true,
        }
    },
    {
        collection: 'users'
    });


const historySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    cardid: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true
    }
}, {
        collection: 'history'
    });


var Users = module.exports.User = mongoose.model('user', userSchema);
var History = module.exports.History = mongoose.model('history', historySchema);



if (createAdmin) {
    var createHash = (password) => {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    };
    
    var newUser = new Users({
        name: '*',
        surname: '*',
        username: '*',
        password: createHash('*'),
        email: '*',
        cardid: '*',
        admin: true
    });

    Users.findOne({ admin: true }, (err, user) => {
        if (err) {
            console.log('Error in Firs Initializing: ' + err);
        }
        if (user) {
            console.log('Admin account already exists');
        }
        else {
            newUser.save(function (err) {
                if (err) {
                    console.log('Error in Saving user: ' + err);
                    throw err;
                }
                console.log('Admin Registration succesful');
            });
        }
    });
}