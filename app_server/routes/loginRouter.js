const express = require('express');
const passport = require('passport');
var router = express.Router();
var ctrlLogin = require('../controller/loginController');


router.get('/', ctrlLogin.login);
router.post('/', passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: false
}));

module.exports = router;
