const pool = require('../config/database');

class Transaction {
  static async create(data) {
    const {
      booking_id,
      client_id,
      amount,
      payment_method,
      payment_details,
      transaction_id,
      description
    } = data;

    const [result] = await pool.execute(
      `INSERT INTO Transactions 
       (booking_id, client_id, transaction_type, amount, payment_method, payment_details, transaction_id, status, description) 
       VALUES (?, ?, 'payment', ?, ?, ?, ?, 'success', ?)`,
      [
        booking_id,
        client_id,
        amount,
        payment_method,
        payment_details || null,
        transaction_id || null,
        description || 'Booking payment'
      ]
    );
    return result.insertId;
  }

  static async findById(id) {
    const [transactions] = await pool.execute(
      'SELECT * FROM transaction_summary WHERE transaction_id = ?',
      [id]
    );
    return transactions[0] || null;
  }

  static async findByClientId(clientId) {
    const [transactions] = await pool.execute(
      'SELECT * FROM transaction_summary WHERE client_id = ? ORDER BY transaction_date DESC',
      [clientId]
    );
    return transactions;
  }

  static async findAll(filters = {}) {
    let query = 'SELECT * FROM transaction_summary';
    let params = [];
    let conditions = [];

    if (filters.client_id) {
      conditions.push('client_id = ?');
      params.push(filters.client_id);
    }

    if (filters.status) {
      conditions.push('transaction_status = ?');
      params.push(filters.status);
    }

    if (filters.from_date) {
      conditions.push('DATE(transaction_date) >= ?');
      params.push(filters.from_date);
    }

    if (filters.to_date) {
      conditions.push('DATE(transaction_date) <= ?');
      params.push(filters.to_date);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY transaction_date DESC';

    const [transactions] = await pool.execute(query, params);
    return transactions;
  }

  static async getTotalRevenue() {
    const [result] = await pool.execute(
      'SELECT SUM(amount) as total FROM Transactions WHERE status = "success" AND transaction_type = "payment"'
    );
    return result[0].total || 0;
  }
}

module.exports = Transaction;

