const { Router } = require('express');
const { isLoggedIn } = require('../middlewares/authMiddleware');
const availabilityController = require('../controllers/availabilityController');

const router = Router();


router.post('/my', isLoggedIn, availabilityController.addMySlots);


router.get('/:userId', isLoggedIn, availabilityController.listForUser);


router.delete('/:id', isLoggedIn, availabilityController.removeMySlot);


router.post('/alerts/:targetUserId', isLoggedIn, availabilityController.subscribeAlert);
router.delete('/alerts/:targetUserId', isLoggedIn, availabilityController.unsubscribeAlert);
router.get('/alerts/:targetUserId/status', isLoggedIn, availabilityController.getAlertStatus);
router.get('/alerts/my/subscriptions', isLoggedIn, availabilityController.getMySubscriptions);

module.exports = router;

