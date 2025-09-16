const { Router } = require('express');
const { isLoggedIn } = require('../middlewares/authMiddleware');
const availabilityController = require('../controllers/availabilityController');

const router = Router();

// Add or replace my availability slots (batch add)
router.post('/my', isLoggedIn, availabilityController.addMySlots);

// List availability for a specific user
router.get('/:userId', isLoggedIn, availabilityController.listForUser);

// Remove a specific slot (owner only)
router.delete('/:id', isLoggedIn, availabilityController.removeMySlot);

// Subscribe to alerts when a target user adds availability
router.post('/alerts/:targetUserId', isLoggedIn, availabilityController.subscribeAlert);

module.exports = router;

