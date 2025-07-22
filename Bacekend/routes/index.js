const express = require('express');
const router = express.Router();
const adminRoutes = require('../routes/admin');


const skillRoutes = require("./skills");
const authRoutes = require("./auth");
// const adminRoutes = require("./admin");

const { isAdmin , isLoggedIn } = require('../middlewares/authMiddleware');
const metaDataRouter = require('./meta-data');

// Mount Routes
router.use("/skills",isLoggedIn , skillRoutes);
router.use("/auth", authRoutes);
router.use("/admin", isAdmin,  adminRoutes);  
router.use("/meta-data", isLoggedIn,  metaDataRouter);  


module.exports = router;