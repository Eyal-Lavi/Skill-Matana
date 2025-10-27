const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController');
const { isLoggedIn } = require('../middlewares/authMiddleware');

router.get('/all',isLoggedIn, skillController.getAllSkills);
router.get('/',isLoggedIn, skillController.getSkillsForUser);
router.post('/new',isLoggedIn, skillController.addSkill);
router.post('/add-user-skill',isLoggedIn, skillController.addSkill);
router.post('/skill-requests' , isLoggedIn , skillController.requestSkill);

module.exports = router;