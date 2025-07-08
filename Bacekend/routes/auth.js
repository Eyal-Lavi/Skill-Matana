const express = require('express');
const router = express.Router();
const { handleValidationErrors } = require('./validations/validation');
const authController = require('../controllers/authController');
const {
  validateLogin,
  validateRegister,
  validateUpdateProfile
} = require('./validations/authValidation');
const upload = require('../middlewares/uploadMiddleware');


router.post('/login', validateLogin, handleValidationErrors, authController.login);
router.post('/register', validateRegister, handleValidationErrors, authController.register);
router.post('/update-profile', upload.single('profilePicture'), validateUpdateProfile, handleValidationErrors, authController.updateUserProfile);
router.post('/logout', authController.logout);
router.get('/session', authController.getSession);

module.exports = router;