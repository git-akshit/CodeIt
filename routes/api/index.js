const express = require('express'); // it will have instance as main index.js

const router = express.Router();

router.use('/v1', require('./v1')); // creating route for v1 

module.exports = router;