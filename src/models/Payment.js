const pool = require('../config/database');

class Payment {
  static async createHistory(data) {
    const { transaction_id, booking_id, client_id, amount, payment_method, receipt_number } = data;

    const [result] = await pool.execute(
      `INSERT INTO Payment_History 
       (transaction_id, booking_id, client_id, amount, payment_method, payment_status, receipt_number) 
       VALUES (?, ?, ?, ?, ?, 'success', ?)`,
      [transaction_id, booking_id, client_id, amount, payment_method, receipt_number]
    );
    return result.insertId;
  }

  static async findByReceiptNumber(receiptNumber) {
    const [payments] = await pool.execute(
      `SELECT ph.*, c.name as client_name, c.email as client_email, c.phone as client_phone,
              b.travel_date, b.travel_time, b.num_passengers, b.seats,
              r.from_location, r.to_location, r.duration
       FROM Payment_History ph
       JOIN Clients c ON ph.client_id = c.id
       JOIN Bookings b ON ph.booking_id = b.id
       JOIN Routes r ON b.route_id = r.id
       WHERE ph.receipt_number = ?`,
      [receiptNumber]
    );
    return payments[0] || null;
  }

  static async findByClientId(clientId) {
    const [payments] = await pool.execute(
      `SELECT ph.*, b.travel_date, r.from_location, r.to_location
       FROM Payment_History ph
       JOIN Bookings b ON ph.booking_id = b.id
       JOIN Routes r ON b.route_id = r.id
       WHERE ph.client_id = ?
       ORDER BY ph.payment_date DESC`,
      [clientId]
    );
    return payments;
  }

  static async findAll(filters = {}) {
    let query = `
      SELECT ph.*, c.name as client_name, c.email as client_email, 
             b.travel_date, r.from_location, r.to_location
      FROM Payment_History ph
      JOIN Clients c ON ph.client_id = c.id
      JOIN Bookings b ON ph.booking_id = b.id
      JOIN Routes r ON b.route_id = r.id
    `;
    let params = [];
    let conditions = [];

    if (filters.client_id) {
      conditions.push('ph.client_id = ?');
      params.push(filters.client_id);
    }

    if (filters.from_date) {
      conditions.push('DATE(ph.payment_date) >= ?');
      params.push(filters.from_date);
    }

    if (filters.to_date) {
      conditions.push('DATE(ph.payment_date) <= ?');
      params.push(filters.to_date);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY ph.payment_date DESC';

    const [payments] = await pool.execute(query, params);
    return payments;
  }

  static async getRevenueReport(fromDate, toDate) {
    let query = `
      SELECT 
        DATE(payment_date) as date,
        SUM(amount) as total_revenue,
        COUNT(*) as transaction_count,
        AVG(amount) as avg_transaction
      FROM Payment_History
    `;
    let params = [];
    let conditions = [];

    if (fromDate) {
      conditions.push('DATE(payment_date) >= ?');
      params.push(fromDate);
    }

    if (toDate) {
      conditions.push('DATE(payment_date) <= ?');
      params.push(toDate);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' GROUP BY DATE(payment_date) ORDER BY date DESC';

    const [report] = await pool.execute(query, params);
    return report;
  }
}

module.exports = Payment;

