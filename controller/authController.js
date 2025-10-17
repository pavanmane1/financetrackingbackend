const AuthService = require('../service/authService');
const { validationResult } = require('express-validator');

class AuthController {
    static async register(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const user = await AuthService.register(req.body);
            res.status(201).json({
                message: 'User registered successfully',
                user
            });
        } catch (error) {
            next(error);
        }
    }

    static async login(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { username, password } = req.body;
            const result = await AuthService.login(username, password);

            res.json({
                message: 'Login successful',
                ...result
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AuthController;