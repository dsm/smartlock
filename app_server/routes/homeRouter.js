const express = require('express');
var router = express.Router();
var ctrlHome = require('../controller/homeController');


router.get('/', ctrlHome.home);
router.get('/openTheDoor', ctrlHome.openTheDoor);
router.get('/closeTheDoor', ctrlHome.closeTheDoor);

module.exports = router;