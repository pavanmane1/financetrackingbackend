const express = require('express');
const AuthController = require('../controller/authController');
const { registerValidation, loginValidation } = require('../middleware/validationMiddleware');

const router = express.Router();

router.post('/register', registerValidation, AuthController.register);
router.post('/login', loginValidation, AuthController.login);

module.exports = router;