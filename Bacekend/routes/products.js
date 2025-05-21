const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { isLoggedIn } = require('../middlewares/authMiddleware');

router.get('/all',productController.getAllProducts);
router.get('/',isLoggedIn,productController.getProduct);
// router.get('/:id',productController.getProduct);

module.exports = router;