const express = require('express');
const router = express.Router();
const { handleValidationErrors } = require('./validations/validation');
const authController = require('../controllers/authController');
const {
  validateLogin,
  validateRegister,
  validateUpdateProfile,
  validatePassword
} = require('./validations/authValidation');


router.post('/login', validateLogin, handleValidationErrors, authController.login);
router.post('/register', validateRegister, handleValidationErrors, authController.register);
router.post('/update-profile', validateUpdateProfile, handleValidationErrors, authController.updateUserProfile);
router.post('/logout', authController.logout);
router.get('/session', authController.getSession);
router.post('/forgot-password' , authController.sendPasswordResetLink);
router.post('/check-link' , authController.chekPasswordResetLink);
router.post('/reset-password', validatePassword , authController.resetPassword);

module.exports = router;