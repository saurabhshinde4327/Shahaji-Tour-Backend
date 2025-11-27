const express = require('express');
const router = express.Router();
const clientRoutes = require('./clientRoutes');
const routeRoutes = require('./routeRoutes');
const adminRoutes = require('./adminRoutes');
const bookingRoutes = require('./bookingRoutes');
const transactionRoutes = require('./transactionRoutes');
const paymentRoutes = require('./paymentRoutes');

// Health check
router.get('/health', async (req, res) => {
  try {
    const pool = require('../config/database');
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    res.json({ status: 'success', message: 'Database connection healthy' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// API Routes
router.use('/clients', clientRoutes);
router.use('/routes', routeRoutes);
router.use('/admin', adminRoutes);
router.use('/bookings', bookingRoutes);
router.use('/transactions', transactionRoutes);
router.use('/payments', paymentRoutes);

module.exports = router;

