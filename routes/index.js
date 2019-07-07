const express = require('express'); // it will have instance as main index.js

const router = express.Router();
const homeController = require('../controllers/home_controller');

console.log('router loaded');

router.get('/', homeController.home);// this router is now accessing the home_controller

module.exports = router;