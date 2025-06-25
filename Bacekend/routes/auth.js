const express = require('express');
const router = express.Router();
const {handleValidationErrors} = require('./validations/validation');
const authController = require('../controllers/authController');
const { 
        validateLogin,
        validateRegister
      } = require('./validations/authValidation');



router.post('/login', validateLogin, handleValidationErrors, authController.login);
router.post('/register',validateRegister, handleValidationErrors, authController.register);
router.post('/logout', authController.logout);
router.get('/session', authController.getSession);

module.exports = router;