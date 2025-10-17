const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const { jwtConfig } = require('../config/jwt'); // Make sure this path is correct
const logger = require('../utils/logger');

class AuthService {
    static async register(userData) {
        const { username, password, name } = userData;

        // Check if user exists
        const existingUser = await User.findByUsername(username);
        if (existingUser) {
            throw new Error('Username already exists');
        }

        // Hash password
        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Create user
        const user = await User.create({
            username,
            passwordHash,
            name
        });

        logger.info(`User registered: ${username}`);
        return user;
    }

    static async login(username, password) {
        const user = await User.findByUsername(username);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        // Debug: Check what password field exists
        console.log('User object:', user);

        // Try different possible password field names
        const passwordHash = user.password || user.password_hash || user.passwordHash;
        if (!passwordHash) {
            throw new Error('Password field not found in user object');
        }

        const isPasswordValid = await bcrypt.compare(password, passwordHash);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        // Update last login
        await User.updateLastLogin(user.id);

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            jwtConfig.secret,
            { expiresIn: jwtConfig.expiresIn }
        );

        logger.info(`User logged in: ${username}`);
        return {
            token,
            user: {
                id: user.id,
                username: user.username,
                name: user.name
            }
        };
    }
}

module.exports = AuthService;