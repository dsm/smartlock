const express = require('express');
var router = express.Router();
var ctrlHistory = require('../controller/historyController');

router.get('/', ctrlHistory.history);
router.get('/deleteUser/', ctrlHistory.delete);


module.exports = router;