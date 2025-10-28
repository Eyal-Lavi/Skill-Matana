const express = require('express');
const router = express.Router();
const connectionRequestsController = require('../controllers/connectionRequestsController');
const { isLoggedIn } = require('../middlewares/authMiddleware');


router.get('/all', isLoggedIn, connectionRequestsController.getAllRequestsForUser);
router.get('/received', isLoggedIn, connectionRequestsController.getReceivedRequestsForUser);
router.get('/sent', isLoggedIn, connectionRequestsController.getSentRequestsForUser);


router.post('/', isLoggedIn, connectionRequestsController.sendConnectionRequest);


router.patch('/:id', isLoggedIn, connectionRequestsController.updateRequestStatus);

router.delete('/:id', isLoggedIn, connectionRequestsController.deleteRequest);

module.exports = router;
