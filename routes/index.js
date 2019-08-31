//this route is root for all other routes,centralize route for every route file
const express = require('express'); // it will have instance as main index.js

const router = express.Router();
const homeController = require('../controllers/home_controller');

console.log('router loaded');

router.get('/', homeController.home);// this router is now accessing the home_controller,this router handles home
router.use('/users', require('./users')); // whenever request is for users then require neigbour which is users.js,this router handles users
router.use('/posts', require('./posts'));//this is used to use post router
router.use('/comments', require('./comments'));//this is used to use comment router
router.use('/reset_passwords', require('./reset_passwords'));
router.use('/likes', require('./likes'));
router.use('/friends', require('./friends'));

router.use('/api', require('./api'));
//for any further routes, access from here
//router.use('/routerName', require('./routerfile'));

module.exports = router;