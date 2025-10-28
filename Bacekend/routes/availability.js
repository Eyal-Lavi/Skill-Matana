const { Router } = require('express');
const { isLoggedIn } = require('../middlewares/authMiddleware');
const availabilityController = require('../controllers/availabilityController');

const router = Router();


router.post('/my', isLoggedIn, availabilityController.addMySlots);


router.get('/:userId', isLoggedIn, availabilityController.listForUser);


router.delete('/:id', isLoggedIn, availabilityController.removeMySlot);


router.post('/alerts/:targetUserId', isLoggedIn, availabilityController.subscribeAlert);

module.exports = router;

