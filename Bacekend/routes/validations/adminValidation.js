const { body } = require("express-validator");

const validateAddPermissionToDB = [
  body('permissionName')
    .trim()
    .escape()
    .exists().withMessage('permissionName is required')
    .notEmpty().withMessage('permissionName cannot be empty')
    .isLength({ min: 2 }).withMessage('permissionName must be at least 2 characters'),
];

const validateAddPermissionToUser = [
  body('userId').exists().withMessage('userId is required')
  .notEmpty().withMessage('userId cannot be empty'),
  body('permissionId').exists().withMessage('permissionId is required')
  .notEmpty().withMessage('permissionId cannot be empty'),
];


module.exports = {
    validateAddPermissionToDB,
    validateAddPermissionToUser
}