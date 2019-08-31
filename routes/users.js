const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersController = require('../controllers/users_controller');

router.get('/profile/:id', passport.checkAuthentication,usersController.profile);// if the user is authenticated only then the profile page will be loaded
router.post('/update/:id', passport.checkAuthentication,usersController.update);// if the user is authenticated only then the profile page will be loaded

router.get('/sign-up', usersController.signUp);
router.get('/sign-in', usersController.signIn);
// router.get('/forgot', usersController.forgot);


router.post('/create', usersController.create); // creating/defining a route for creating a user

//use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/users/sign-in'}, //if failed then redirect to sign-in page
), usersController.createSession);

router.get('/sign-out', usersController.destroySession);// signing out destroying the session


//creating routes for google sign up
router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']})); //scope is the information that we need
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/sign-in'}), usersController.createSession);//on this route we will recieve the data, if user has signed in then usersController.createSession takes to home page

module.exports = router;