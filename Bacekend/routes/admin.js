const { validateAddPermissionToDB ,validateAddPermissionToUser} = require('./validations/adminValidation');
const { handleValidationErrors } = require('./validations/validation');
const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');

router.post('/add-permission' ,validateAddPermissionToDB,handleValidationErrors, adminController.addPermissionToDB);
router.post('/add-permission-to-user',validateAddPermissionToUser,handleValidationErrors, adminController.addPermissionToUser);
router.post('/skill-requests/status' , adminController.handleSkillRequestStatus);
router.get('/skill-requests/pending' , adminController.fetchPendingRequests);
router.put('/skills/status' , adminController.handleSkillStatusUpdate);

module.exports = router;