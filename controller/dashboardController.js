const DashboardService = require('../service/dashboardService');

class DashboardController {
    static async getDashboard(req, res, next) {
        try {
            const dashboardData = await DashboardService.getDashboardData(req.user.userId);
            res.json(dashboardData);
        } catch (error) {
            next(error);
        }
    }

    static async getAnalytics(req, res, next) {
        try {
            const { year, month } = req.query;
            const currentDate = new Date();

            const analytics = await DashboardService.getAnalytics(
                req.user.userId,
                parseInt(year) || currentDate.getFullYear(),
                parseInt(month) || currentDate.getMonth() + 1
            );

            res.json(analytics);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = DashboardController;