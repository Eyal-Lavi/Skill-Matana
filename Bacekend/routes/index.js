const express = require('express');
const router = express.Router();

const authRoute = require('./auth');

router.use('/',authRoute);

router.use('/',(req,res,next)=>{
    res.send('Home')
});

module.exports = router;