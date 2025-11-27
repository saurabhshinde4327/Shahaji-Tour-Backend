const Razorpay = require('razorpay');
const config = require('../config');
const RazorpayPayment = require('../models/RazorpayPayment');
const logger = require('../utils/logger');

class PaymentService {
  constructor() {
    this.razorpay = new Razorpay({
      key_id: config.razorpay.keyId,
      key_secret: config.razorpay.keySecret
    });
  }

  async createOrder(amount, currency = 'INR', receipt, notes = {}) {
    const options = {
      amount: parseInt(amount, 10),
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1,
      notes: notes || {}
    };

    const order = await this.razorpay.orders.create(options);

    // Save to database
    await RazorpayPayment.create({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: 'created',
      notes: order.notes
    });

    return order;
  }

  async handleWebhook(event, signature, rawBody) {
    // Verify signature
    const crypto = require('crypto');
    const generatedSig = crypto
      .createHmac('sha256', config.razorpay.webhookSecret)
      .update(rawBody)
      .digest('hex');

    if (generatedSig !== signature) {
      throw new Error('Invalid webhook signature');
    }

    // Handle payment events
    if (event.event === 'payment.captured' || event.event === 'order.paid') {
      const payload = event.payload;
      const paymentEntity = payload.payment ? payload.payment.entity : null;
      const orderId = paymentEntity ? paymentEntity.order_id : 
        (payload.order && payload.order.entity && payload.order.entity.id);

      if (orderId) {
        await RazorpayPayment.updateByOrderId(orderId, {
          status: 'paid',
          payment_id: paymentEntity && paymentEntity.id ? paymentEntity.id : null,
          gateway_response: event
        });
      }
    }

    return true;
  }
}

module.exports = new PaymentService();

