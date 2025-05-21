const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController');
const { isLoggedIn } = require('../middlewares/authMiddleware');

router.get('/all', isLoggedIn , skillController.getAllSkills);
router.get('/:id', isLoggedIn ,skillController.getSkill);

module.exports = router;