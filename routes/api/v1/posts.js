const express = require('express'); // it will have instance as main index.js

const router = express.Router();
const passport = require('passport');
const postsApi = require("../../../controllers/api/v1/posts_api"); //requiring posts api

router.get('/', postsApi.index);
router.delete('/:id', passport.authenticate('jwt', {session: false}), postsApi.destroy);//authenticating using passport, session: false means do not generate session cookies

module.exports = router;