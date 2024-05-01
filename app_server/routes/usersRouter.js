const express = require('express');
var router = express.Router();
var ctrlUsers = require('../controller/usersController');

router.get('/', ctrlUsers.user);
router.get('/updateUser/:username', ctrlUsers.updateGET);
router.get('/deleteUser/:username', ctrlUsers.delete);
router.post('/updateUser/:username', ctrlUsers.updatePOST);
router.get('/addAdmin/:username', ctrlUsers.addAdmin);
router.get('/removeAdmin/:username', ctrlUsers.removeAdmin);
module.exports = router;