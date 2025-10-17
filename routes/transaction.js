const express = require('express');
const TransactionController = require('../controller/transactionController');
const {
    validateCreateTransaction,
    validateUpdateTransaction,
    validateGetTransactions
} = require('../middleware/validationMiddleware');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// ✅ Protect all routes
router.use(authenticateToken);

// ✅ Create Transaction
router.post('/', validateCreateTransaction, TransactionController.createTransaction);

// ✅ Get Transactions (with optional query filters)
router.get('/', validateGetTransactions, TransactionController.getTransactions);

// ✅ Get Single Transaction
router.get('/:id', TransactionController.getTransaction);

// ✅ Update Transaction
router.put('/:id', validateUpdateTransaction, TransactionController.updateTransaction);

// ✅ Delete Transaction
router.delete('/:id', TransactionController.deleteTransaction);

module.exports = router;
