const { body } = require("express-validator");

const validateRegister = [
  body('email')
    .trim()
    .exists().withMessage('Email is required')
    .isEmail().withMessage('Email is invalid')
    .normalizeEmail().withMessage('Email is invalid'),

  body('gender')
    .trim()
    .escape()
    .exists().withMessage('Gender is required')
    .notEmpty().withMessage('Gender cannot be empty')
    .custom((value, { req }) => {
      value = value.toLowerCase();
      if(value !== 'male' && value !== 'female') {
        return false;
      }
      return true;
    }).withMessage('Gender must be male or female'),

  body('username')
    .trim()
    .escape()
    .exists().withMessage('Username is required')
    .notEmpty().withMessage('Username cannot be empty')
    .isLength({ min: 2 }).withMessage('Password must be at least 2 characters'),

  body('firstname')
    .trim()
    .escape()
    .exists().withMessage('Firstname is required')
    .notEmpty().withMessage('Firstname cannot be empty')
    .isLength({ min: 2 }).withMessage('Firstname must be at least 2 characters'),

  body('lastname')
    .trim()
    .escape()
    .exists().withMessage('Lastname is required')
    .notEmpty().withMessage('Lastname cannot be empty')
    .isLength({ min: 2 }).withMessage('Lastname must be at least 2 characters'),

  body('password')
    .trim()
    .exists().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

];

const validateUpdateProfile = [
  body('email')
    .trim()
    .exists().withMessage('Email is required')
    .isEmail().withMessage('Email is invalid')
    .normalizeEmail().withMessage('Email is invalid'),

  body('gender')
    .trim()
    .escape()
    .exists().withMessage('Gender is required')
    .notEmpty().withMessage('Gender cannot be empty')
    .custom((value, { req }) => {
      value = value.toLowerCase();
      if(value !== 'male' && value !== 'female') {
        return false;
      }
      return true;
    }).withMessage('Gender must be male or female'),

  body('username')
    .trim()
    .escape()
    .exists().withMessage('Username is required')
    .notEmpty().withMessage('Username cannot be empty')
    .isLength({ min: 2 }).withMessage('Password must be at least 2 characters'),

  body('firstname')
    .trim()
    .escape()
    .exists().withMessage('Firstname is required')
    .notEmpty().withMessage('Firstname cannot be empty')
    .isLength({ min: 2 }).withMessage('Firstname must be at least 2 characters'),

  body('lastname')
    .trim()
    .escape()
    .exists().withMessage('Lastname is required')
    .notEmpty().withMessage('Lastname cannot be empty')
    .isLength({ min: 2 }).withMessage('Lastname must be at least 2 characters'),

  // body('password')
  //   .trim()
  //   .exists().withMessage('Password is required')
  //   .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

];

const validateLogin = [
  body('usernameOrEmail').exists().withMessage('Username or Email is required')
  .notEmpty().withMessage('Username Or Email cannot be empty'),
  body('password').exists().withMessage('Password is required')
  .notEmpty().withMessage('Password cannot be empty'),
];


module.exports = {
    validateLogin,
    validateRegister,
    validateUpdateProfile
}