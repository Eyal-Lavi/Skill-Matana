const express = require('express');
const router = express.Router();


const productRoutes = require("./products");
const authRoutes = require("./auth");
const adminRoutes = require("./admin");

const { isLoggedIn } = require('../middlewares/authMiddleware');

// Mount Routes
router.use("/products", productRoutes);
router.use("/", authRoutes);
// router.use("/admin", isLoggedIn , authRoutes);  //need implement mid for permisson navigation
router.use("/admin", adminRoutes);  //need implement mid for permisson navigation


module.exports = router;