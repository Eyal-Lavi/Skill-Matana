const express = require('express');
const router = express.Router();


// const productRoutes = require("./products");
const authRoutes = require("./auth");
// const adminRoutes = require("./admin");

const { isLoggedIn ,isAdmin} = require('../middlewares/authMiddleware');

// Mount Routes
// router.use("/products", productRoutes);
router.use("/", authRoutes);
// router.use("/admin", isAdmin , adminRoutes);  //need implement mid for permisson navigation


module.exports = router;