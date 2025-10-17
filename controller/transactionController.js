const TransactionService = require('../service/transactionService');
const { validationResult } = require('express-validator');

class TransactionController {
    static async createTransaction(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const transactionData = {
                ...req.body,
                userId: req.user.userId
            };

            // Map field names to match database schema
            const mappedData = {
                user_id: transactionData.userId,
                amount: transactionData.amount,
                transaction_date: transactionData.date || transactionData.transaction_date,
                description: transactionData.description,
                category_id: transactionData.categoryId || transactionData.category_id,
                category_type: transactionData.categoryType || transactionData.category_type,
                category: transactionData.category
            };

            const transaction = await TransactionService.createTransaction(mappedData);
            res.status(201).json({
                message: 'Transaction created successfully',
                transaction
            });
        } catch (error) {
            next(error);
        }
    }

    static async getTransactions(req, res, next) {
        try {
            const filters = {
                startDate: req.query.startDate,
                endDate: req.query.endDate,
                categoryId: req.query.categoryId
            };

            const transactions = await TransactionService.getUserTransactions(req.user.userId, filters);
            res.json({
                transactions
            });
        } catch (error) {
            next(error);
        }
    }

    static async getTransaction(req, res, next) {
        try {
            const transaction = await TransactionService.getTransactionById(req.params.id, req.user.userId);
            res.json({
                transaction
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateTransaction(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // Map field names to match database schema
            const updateData = {
                amount: req.body.amount,
                transaction_date: req.body.date || req.body.transaction_date,
                description: req.body.description,
                category_id: req.body.categoryId || req.body.category_id,
                category_type: req.body.categoryType || req.body.category_type,
                category: req.body.category
            };

            const transaction = await TransactionService.updateTransaction(
                req.params.id,
                req.user.userId,
                updateData
            );

            res.json({
                message: 'Transaction updated successfully',
                transaction
            });
        } catch (error) {
            next(error);
        }
    }

    static async deleteTransaction(req, res, next) {
        try {
            await TransactionService.deleteTransaction(req.params.id, req.user.userId);
            res.json({
                message: 'Transaction deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    static async getMonthlySummary(req, res, next) {
        try {
            const { year, month } = req.query;
            const summary = await TransactionService.getMonthlySummary(req.user.userId, year, month);
            res.json({
                summary
            });
        } catch (error) {
            next(error);
        }
    }

    static async getCategorySummary(req, res, next) {
        try {
            const { startDate, endDate } = req.query;
            const summary = await TransactionService.getCategorySummary(req.user.userId, startDate, endDate);
            res.json({
                summary
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = TransactionController;