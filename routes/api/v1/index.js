const express = require('express'); // it will have instance as main index.js

const router = express.Router();

router.use('/posts', require('./posts')); //requiring posts
router.use('/users', require('./users')); //requiring users


module.exports = router;