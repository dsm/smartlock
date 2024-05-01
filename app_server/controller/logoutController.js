module.exports.logout = (req, res, next) => {
    req.logout()
    res.redirect('/login')
    console.log("User log out")
};

