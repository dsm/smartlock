const express = require('express');
var router = express.Router();
var ctrlLogout = require('../controller/logoutController');

router.get('/', ctrlLogout.logout);

module.exports = router;
