var History = require('../models/users').History;

module.exports.history = (req, res) => {
    History
        .find()
        .sort({ date: -1 })
        .then((results) => {
            res.render('history',
                {
                    userAuth: req.isAuthenticated(),
                    admin: true,
                    History: results
                })
        })
        .catch(err => {
            //console.log(err)
        })
};

module.exports.delete = (req, res) => {
    History
        .remove()
        .then(() => {
            res.redirect('/history');
        })
        .catch(err => {
            console.log('deleting unsuccesful' + err);
        });
}