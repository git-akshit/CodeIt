const express = require('express');
const router = express.Router();
const passport = require('passport');

const commentsController = require('../controllers/comments_controller');//now we can access everything in comments_controller

router.post('/create', passport.checkAuthentication, commentsController.create);//creating the route for comments
//even if a user creates a form with develpoer tools he wont be able to send data to db as he is not authenticated as passport will check its authentication, this check is being done at action level
router.get('/destroy/:id', passport.checkAuthentication, commentsController.destroy);

module.exports = router;