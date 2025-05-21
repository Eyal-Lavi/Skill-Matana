const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const { isLoggedIn } = require('../middlewares/authMiddleware');

router.post('/add_permission',adminController.addPermission);
// router.post('/edit_user',adminController.editUser);

module.exports = router;