const express = require('express');
const { authGuard } = require('./../middleware/authGuard');
const userControllers = require('../controllers/userControllers');

const router = express.Router();

router.post('/register', userControllers.registerUser);
router.post('/login', userControllers.loginUser);

router.post('/forgot_password', userControllers.forgotPassword)

router.post('/verify_otp', userControllers.verifyOtpAndPassword)

router.get('/get_user/:id', userControllers.getUserDetails)

router.post('/update_user/:id', authGuard, userControllers.updateUser);

router.post('/update_profile_image/:id', authGuard, userControllers.updateProfileImage);
router.post('/logout', authGuard, userControllers.logoutUser);


module.exports = router;
