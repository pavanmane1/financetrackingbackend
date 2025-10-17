const Transaction = require('../model/Transaction');
const Category = require('../model/Category');
const logger = require('../utils/logger');

class TransactionService {
    static async createTransaction(transactionData) {
        // Validate category if category_id is provided
        if (transactionData.category_id) {
            const category = await Category.findById(transactionData.category_id);
            if (!category) {
                throw new Error('Invalid category');
            }
        }

        const transaction = await Transaction.create(transactionData);
        logger.info(`Transaction created: ${transaction.transaction_id} for user ${transactionData.userId}`);
        return transaction;
    }

    static async getUserTransactions(userId, filters = {}) {
        return await Transaction.findByUserId(userId, filters);
    }

    static async getTransactionById(transaction_id, userId) {
        const transaction = await Transaction.findById(transaction_id, userId);
        if (!transaction) {
            throw new Error('Transaction not found');
        }
        return transaction;
    }

    static async updateTransaction(transaction_id, userId, updateData) {
        // Validate category if category_id is provided
        if (updateData.category_id) {
            const category = await Category.findById(updateData.category_id);
            if (!category) {
                throw new Error('Invalid category');
            }
        }

        const transaction = await Transaction.update(transaction_id, userId, updateData);
        if (!transaction) {
            throw new Error('Transaction not found');
        }

        logger.info(`Transaction updated: ${transaction_id} for user ${userId}`);
        return transaction;
    }

    static async deleteTransaction(transaction_id, userId) {
        const transaction = await Transaction.delete(transaction_id, userId);
        if (!transaction) {
            throw new Error('Transaction not found');
        }

        logger.info(`Transaction deleted: ${transaction_id} for user ${userId}`);
        return transaction;
    }

    static async getMonthlySummary(userId, year, month) {
        return await Transaction.getMonthlySummary(userId, year, month);
    }

    static async getCategorySummary(userId, startDate, endDate) {
        return await Transaction.getCategorySummary(userId, startDate, endDate);
    }
}

module.exports = TransactionService;