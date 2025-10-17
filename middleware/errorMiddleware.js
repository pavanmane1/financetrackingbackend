const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
    logger.error(`Error: ${err.message}`, {
        url: req.url,
        method: req.method,
        userId: req.user ? req.user.userId : 'unknown'
    });

    // Default error
    let statusCode = 500;
    let message = 'Internal server error';

    // Custom error handling
    if (err.message.includes('not found')) {
        statusCode = 404;
        message = err.message;
    } else if (err.message.includes('Invalid credentials') || err.message.includes('Invalid category')) {
        statusCode = 400;
        message = err.message;
    } else if (err.message.includes('Username already exists')) {
        statusCode = 409;
        message = err.message;
    }

    res.status(statusCode).json({
        error: message
    });
};

module.exports = { errorHandler };