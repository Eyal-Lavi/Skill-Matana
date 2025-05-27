const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const { isLoggedIn } = require('../middlewares/authMiddleware');

router.post('/add_permission' , adminController.addPermission);
router.post('/add_permission_to_user',adminController.addUserPermission);

module.exports = router;