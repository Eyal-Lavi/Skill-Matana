const express = require('express');
const router = express.Router();
const connectionRequestsController = require('../controllers/connectionRequestsController');
const { isLoggedIn } = require('../middlewares/authMiddleware');

// List all requests for current user
router.get('/all', isLoggedIn, connectionRequestsController.getAllRequestsForUser);
router.get('/received', isLoggedIn, connectionRequestsController.getReceivedRequestsForUser);
router.get('/sent', isLoggedIn, connectionRequestsController.getSentRequestsForUser);

// Create a new request
router.post('/', isLoggedIn, connectionRequestsController.sendConnectionRequest);

// Update request status (approve/reject)
router.patch('/:id', isLoggedIn, connectionRequestsController.updateRequestStatus);
// Cancel a sent request (sender only, pending only)
router.delete('/:id', isLoggedIn, connectionRequestsController.deleteRequest);

module.exports = router;
