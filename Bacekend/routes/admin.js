const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');

router.post('/add-permission' , adminController.addPermissionToDB);
router.post('/add-permission-to-user',adminController.addPermissionToUser);

module.exports = router;