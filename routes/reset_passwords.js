const express = require('express');
const router = express.Router();
const resetPasswordController = require('../controllers/reset_password_controller');//now we can access everything in posts_controller

router.get('/forgot', resetPasswordController.forgot);

router.post('/reset', resetPasswordController.reset);
router.get('/change/:token', resetPasswordController.change);
router.post('/changePassword/:token', resetPasswordController.changePassword);
module.exports = router;