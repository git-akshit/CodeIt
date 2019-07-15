const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersController = require('../controllers/users_controller');

router.get('/profile', passport.checkAuthentication,usersController.profile);// if the user is authenticated only then the profile page will be loaded

router.get('/sign-up', usersController.signUp);
router.get('/sign-in', usersController.signIn);

router.post('/create', usersController.create); // creating/defining a route for creating a user

//use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/users/sign-in'}, //if failed then redirect to sign-in page
), usersController.createSession);

router.get('/sign-out', usersController.destroySession);// signing out destroying the session

module.exports = router;