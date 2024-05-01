var LocalStrategy = require('passport-local').Strategy;
var Users = require('../models/users').User;
var bCrypt = require('bcrypt-nodejs');


module.exports = (passport) => {
    passport.use('login',
        new LocalStrategy(
            {
                passReqToCallback: true,
            },
            (req, username, password, done) => {
                // check in mongo if a user with username exists or not
                Users.findOne({ 'username': username })
                    .then((user) => {
                        // Username does not exist, log the error and redirect back
                        if (!user) {
                            console.log('User Not Found with username ' + username);
                            return done(null, false, req.flash('message', 'User Not found.'));
                        }
                        // User exists but wrong password, log the error 
                        if (!isValidPassword(user, password)) {
                            console.log('Invalid Password');
                            return done(null, false, req.flash('message', 'Invalid Password')); // redirect back to login page
                        }
                        // User and password both match, return user from done method
                        // which will be treated like success
                        console.log("User Login")
                        return done(null, user);
                    }
                    ).catch(err => {
                        return done(err);
                    });

            })
    );
    var isValidPassword = (user, password) => {
        return bCrypt.compareSync(password, user.password);
    }

};
