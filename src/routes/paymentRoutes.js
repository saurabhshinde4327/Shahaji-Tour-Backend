const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/paymentController');

// Razorpay routes removed (create-order, webhook)
router.get('/', PaymentController.getAll);
router.get('/receipt/:receiptNumber', PaymentController.getByReceipt);
router.get('/client/:clientId', PaymentController.getByClient);

module.exports = router;

