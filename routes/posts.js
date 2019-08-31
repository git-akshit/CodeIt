const express = require('express');
const router = express.Router();
const passport = require('passport');

const postsController = require('../controllers/posts_controller');//now we can access everything in posts_controller

router.post('/create', passport.checkAuthentication, postsController.create);//creating the route for posts
//even if a user creates a form with develpoer tools he wont be able to send data to db as he is not authenticated as passport will check its authentication, this check is being done at action level

router.get('/destroy/:id', passport.checkAuthentication, postsController.destroy);// getting the id and destroying the post
module.exports = router;