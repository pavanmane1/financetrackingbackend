const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config/jwt');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    jwt.verify(token, jwtConfig.secret, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }

        // Debug logging
        console.log('JWT Payload:', user);
        console.log('Extracted User ID:', user.userId);

        req.user = user;
        next();
    });
};

module.exports = { authenticateToken };