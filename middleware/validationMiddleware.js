const { body, query } = require('express-validator');

/**
 * ✅ Register Validation
 */
const registerValidation = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('Username must be between 3 and 100 characters'),
    body('password')
        .trim()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('name')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Name must not exceed 100 characters'),
];

/**
 * ✅ Login Validation
 */
const loginValidation = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required'),
];

/**
 * ✅ Create Transaction Validation
 */
const validateCreateTransaction = [
    body('amount')
        .notEmpty()
        .withMessage('Amount is required')
        .isFloat({ min: 0.01 })
        .withMessage('Amount must be a valid number greater than 0'),
    body('transaction_date')
        .notEmpty()
        .withMessage('Transaction date is required')
        .isISO8601()
        .withMessage('Transaction date must be a valid ISO date'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description must be less than 500 characters'),
    body('category_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Category ID must be a positive integer'),
];

/**
 * ✅ Update Transaction Validation
 */
const validateUpdateTransaction = [
    body('amount')
        .optional()
        .isFloat({ min: 0.01 })
        .withMessage('Amount must be a valid number greater than 0'),
    body('transaction_date')
        .optional()
        .isISO8601()
        .withMessage('Transaction date must be a valid ISO date'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description must be less than 500 characters'),
    body('category_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Category ID must be a positive integer'),
];

/**
 * ✅ Get Transactions Query Validation
 */
const validateGetTransactions = [
    query('startDate')
        .optional()
        .isISO8601()
        .withMessage('Start date must be a valid ISO date'),
    query('endDate')
        .optional()
        .isISO8601()
        .withMessage('End date must be a valid ISO date'),
    query('categoryId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Category ID must be a positive integer'),
];

module.exports = {
    registerValidation,
    loginValidation,
    validateCreateTransaction,
    validateUpdateTransaction,
    validateGetTransactions,
};
