const pool = require('../config/database');

class RazorpayPayment {
  static async create(data) {
    const { order_id, amount, currency, receipt, status, notes } = data;
    const [result] = await pool.execute(
      `INSERT INTO payments (order_id, amount, currency, receipt, status, notes, created_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [order_id, amount, currency, receipt, status, JSON.stringify(notes)]
    );
    return result.insertId;
  }

  static async updateByOrderId(orderId, data) {
    const { status, payment_id, gateway_response } = data;
    const [result] = await pool.execute(
      `UPDATE payments SET status = ?, payment_id = ?, gateway_response = ?, updated_at = NOW()
       WHERE order_id = ?`,
      [status, payment_id, JSON.stringify(gateway_response), orderId]
    );
    return result.affectedRows > 0;
  }
}

module.exports = RazorpayPayment;

