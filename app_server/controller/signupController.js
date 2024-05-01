var Users = require('../models/users').User;

var empty = '';

module.exports.signupGet = (req, res) => {
    res.render('signup', {
        admin: true,
        userAuth: req.isAuthenticated()
    });
};

module.exports.signupPost = (req, res) => {

    var params = {
        'username': req.body.username
    };

    Users
        .findOne(params)
        .then((user) => {
            // already exists
            if (user) {
                console.log('User already exists with username: ' + req.body.username);
                res.redirect('/signup');
            }
            else {

                if (req.body.name == empty || req.body.surname == empty || req.body.username == empty || req.body.cardid == empty || req.body.email == empty) {
                    console.log('Some form is null');
                    res.redirect('/signup');
                }
                else {

                    var params = {
                        name: req.body.name,
                        surname: req.body.surname,
                        username: req.body.username,
                        cardid: req.body.cardid,
                        email: req.body.email,
                        admin: false
                    };

                    new Users(params)
                        .save()
                        .then(() => {
                            console.log('User Registration succesful');
                            res.redirect('users');
                        })
                        .catch(err => {
                            console.log('Error in Saving user: ' + err);
                            throw err;
                        });
                }
            }
        })
        .catch(err => {
            console.log('Error in SignUp: ' + err);
            res.redirect('/signup');
            throw err;
        });
};


