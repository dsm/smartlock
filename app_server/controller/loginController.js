module.exports.login = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.render('home');
        next();
    }
    res.render('login',
        {
            user: req.user,
            admin:false,
            userAuth: req.isAuthenticated()
        });
    next();
};

