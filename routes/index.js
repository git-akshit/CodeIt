//this route is root for all other routes,centralize route for every route file
const express = require('express'); // it will have instance as main index.js

const router = express.Router();
const homeController = require('../controllers/home_controller');

console.log('router loaded');

router.get('/', homeController.home);// this router is now accessing the home_controller,this router handles home
router.use('/users', require('./users')); // whenever request is for users then require neigbour which is users.js,this router handles users

//for any further routes, access from here
//router.use('/routerName', require('./routerfile'));

module.exports = router;