const Transaction = require('../model/Transaction');

class DashboardService {
    static async getDashboardData(userId) {
        try {
            console.log('Debug: Getting dashboard data for user:', userId);

            // Get ALL transactions
            const allTransactions = await Transaction.findByUserId(userId);
            console.log('Debug: All transactions count:', allTransactions.length);

            // Get recent transactions (last 10)
            const recentTransactions = allTransactions.slice(0, 10);

            // Calculate totals from ALL transactions
            let totalIncome = 0;
            let totalExpense = 0;

            allTransactions.forEach(transaction => {
                const amount = parseFloat(transaction.amount) || 0;
                const category = transaction.category_name.toLowerCase();
                if (category === 'income') {
                    totalIncome += amount;
                } else if (category === 'expense') {
                    totalExpense += amount;
                }
            });

            const balance = totalIncome - totalExpense;

            // Calculate monthly data for the current year
            const monthlyData = calculateMonthlyData(allTransactions);

            console.log('Debug: Final totals - Income:', totalIncome, 'Expense:', totalExpense, 'Balance:', balance);
            console.log('Debug: Monthly Data:', monthlyData);

            return {
                summary: {
                    totalIncome,
                    totalExpense,
                    balance
                },
                recentTransactions,
                monthlyData,
                allTransactionsCount: allTransactions.length
            };
        } catch (error) {
            console.error('DashboardService Error:', error);
            throw error;
        }

        function calculateMonthlyData(transactions) {
            const monthlyData = {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                income: new Array(12).fill(0),
                expenses: new Array(12).fill(0)
            };

            transactions.forEach(transaction => {
                // ✅ Use correct field name
                const transactionDate = new Date(transaction.transaction_date);
                if (isNaN(transactionDate)) {
                    console.warn('Warning: Invalid date for transaction:', transaction);
                    return;
                }

                const month = transactionDate.getMonth();
                const amount = parseFloat(transaction.amount) || 0;

                // ✅ Safe lowercase handling
                const category = (transaction.category_name || '').toLowerCase();

                if (category === 'income') {
                    monthlyData.income[month] += amount;
                } else if (category === 'expense') {
                    monthlyData.expenses[month] += amount;
                }

                console.log(
                    'Debug: Transaction processed ->',
                    'Date:', transaction.transaction_date,
                    'Month:', month,
                    'Category:', category,
                    'Amount:', amount
                );
            });

            return monthlyData;
        }
    }

    static async getAnalytics(userId, year, month) {
        try {
            const monthlySummary = await Transaction.getMonthlySummary(userId, year, month);
            console.log('Analytics Debug: Monthly summary for', year, month, ':', monthlySummary);

            const analytics = {
                income: 0,
                expense: 0,
                categories: [],
                year,
                month
            };

            monthlySummary.forEach(item => {
                const amount = parseFloat(item.total_amount) || 0;
                const category = item.category_name.toLowerCase();
                if (category === 'income') analytics.income = amount;
                else if (category === 'expense') analytics.expense = amount;

                analytics.categories.push({
                    category: item.category_name,
                    amount: amount
                });
            });

            analytics.balance = analytics.income - analytics.expense;

            return analytics;
        } catch (error) {
            console.error('Analytics Error:', error);
            throw error;
        }
    }
}

module.exports = DashboardService;
