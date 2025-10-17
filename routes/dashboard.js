const express = require('express');
const DashboardController = require('../controller/dashboardController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticateToken);

router.get('/', DashboardController.getDashboard);
router.get('/analytics', DashboardController.getAnalytics);

module.exports = router;