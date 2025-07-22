const express = require('express');
const router = express.Router();
const metaDataController = require('../controllers/metaDataController');

router.get('/', metaDataController.getMetaData);

module.exports = router;