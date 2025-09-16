const express = require('express');
const router = express.Router();
const adminRoutes = require('../routes/admin');


const skillRoutes = require("./skills");
const connectionRequests = require("./connection-requests");
const authRoutes = require("./auth");
const searchRoutes = require('./search');
// const meetingTokenRouter = require('./meetingToken');
const availabilityRouter = require('./availability');
const meetingsRouter = require('./meetings');
// const adminRoutes = require("./admin");

const { isAdmin , isLoggedIn } = require('../middlewares/authMiddleware');
const metaDataRouter = require('./meta-data');

// Mount Routes
router.use("/skills",isLoggedIn , skillRoutes);
router.use("/auth", authRoutes);
// Unified meetings router: public token + protected actions
router.use('/meetings', meetingsRouter);
router.use('/availability', isLoggedIn, availabilityRouter);
router.use("/admin", isAdmin,  adminRoutes);  
router.use("/meta-data", isLoggedIn,  metaDataRouter);  
router.use('/search' ,isLoggedIn, searchRoutes);
router.use('/connection-requests' ,isLoggedIn, connectionRequests);

module.exports = router;
