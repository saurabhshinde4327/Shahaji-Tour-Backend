const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const ReportController = require('../controllers/reportController');
const { validateLogin } = require('../validators/clientValidator');

router.post('/login', validateLogin, AdminController.login);
router.get('/clients', AdminController.getClients);
router.get('/bookings', AdminController.getBookings);
router.get('/dashboard/stats', AdminController.getDashboardStats);
router.get('/reports/revenue', ReportController.getRevenueReport);
router.get('/reports/popular-routes', ReportController.getPopularRoutes);

module.exports = router;

