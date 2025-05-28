const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController');
const { isLoggedIn } = require('../middlewares/authMiddleware');

router.get('/all', skillController.getAllSkills);
router.get('/', skillController.getSkillsForUser);
router.post('/new', skillController.addSkill);

module.exports = router;