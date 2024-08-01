
// const router=app.router;
const express = require("express");

const router = express();

const authControllers = require('../controllers/auth');
const { body } = require('express-validator');
const validateUser = [
    body('name').not().isEmpty().withMessage('Name required'),
    body('email').isEmail().withMessage('Please Enter a valid email adress'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 caracters')
    .isStrongPassword().withMessage('Password must contain at least one uppercase, one lowercase and one symbol'),
    body('phone').isMobilePhone().withMessage('Please Enter a valid phone number')
]



router.post('/login', authControllers.login);
router.get('/verify-token', authControllers.verifyToken);
router.post('/register',validateUser, authControllers.register);
router.post('/forgot-password', authControllers.forgotPassword);
router.post('/verify-otp', authControllers.verifyOtp);
router.post('/reset-password', authControllers.resetPassword);

module.exports = router;