var Users = require('../models/users').User;
var bCrypt = require('bcrypt-nodejs');

var createHash = (password) => {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

module.exports.user = (req, res, next) => {
    Users
        .find()
        .then((results) => {
            res.render('users', {
                userAuth: req.isAuthenticated(),
                admin: true,
                Users: results
            });
            next();
        })
        .catch(err => {
            console.log(err)
        });

};


module.exports.updateGET = (req, res, next) => {
    Users
        .findOne({ username: req.params.username })
        .then((results) => {
            res.render('updateUser',
                {
                    userAuth: req.isAuthenticated(),
                    admin: true,
                    userGET: results
                })
        })
        .catch(err => {
            console.log(err)
        })
};


module.exports.updatePOST = (req, res, next) => {

    var updatedUser = new Users();

    if (req.body.password == "") {
        updatedUser = {
            name: req.body.name,
            surname: req.body.surname,
            username: req.body.username,
            email: req.body.email,
            cardid: req.body.cardid,

        };
    }
    else {
        updatedUser = {
            name: req.body.name,
            surname: req.body.surname,
            username: req.body.username,
            email: req.body.email,
            password: createHash(req.body.password),
            cardid: req.body.cardid,
        };
        Users
            .findOne({ username: req.params.username })
            .then((results) => {
                updatedUser.admin = results.admin;
                console.log(results.admin)
            })
    }
    var options = { new: true };
    Users
        .findOneAndUpdate({ username: req.params.username }, updatedUser, options)
        .then(() => {
            res.redirect('/users');
            next();
        })
        .catch(err => {
            res.redirect('/users/updateUser/' + req.params.username)
            console.log('user was not updated' + err);
        });
};



module.exports.addAdmin = (req, res, next) => {
    var options = { new: true };
    Users
        .findOneAndUpdate({ username: req.params.username }, { admin: true }, options)
        .then(() => {
            //console.log('user updated' + user);
            res.redirect('/users');
        })
        .catch(err => {
            console.log('user was not updated' + err);
        });
};


module.exports.removeAdmin = (req, res, next) => {
    var options = { new: true };
    Users
        .findOneAndUpdate({ username: req.params.username }, { admin: false }, options)
        .then(() => {
            //console.log('user updated' + user);
            res.redirect('/users');
        })
        .catch(err => {
            console.log('user was not updated' + err);
        });
};

module.exports.delete = (req, res, next) => {

    Users
        .findOneAndRemove({ username: req.params.username })
        .then(() => {
            res.redirect('/users');
        })
        .catch(err => {
            console.log('user was not deleted' + err);
        });


};