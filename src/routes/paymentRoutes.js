const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/paymentController');
const bodyParser = require('body-parser');

// For webhook verification we need rawBody
router.post('/create-order', PaymentController.createOrder);
router.post('/webhook', 
  bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    }
  }),
  PaymentController.webhook
);
router.get('/', PaymentController.getAll);
router.get('/receipt/:receiptNumber', PaymentController.getByReceipt);
router.get('/client/:clientId', PaymentController.getByClient);

module.exports = router;

