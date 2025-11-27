const pool = require('../config/database');

class Client {
  static async create(data) {
    const { name, email, phone, address, password } = data;
    const [result] = await pool.execute(
      'INSERT INTO Clients (name, email, phone, address, password) VALUES (?, ?, ?, ?, ?)',
      [name, email.toLowerCase(), phone, address, password]
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const [clients] = await pool.execute(
      'SELECT * FROM Clients WHERE email = ?',
      [email.toLowerCase()]
    );
    return clients[0] || null;
  }

  static async findById(id) {
    const [clients] = await pool.execute(
      'SELECT id, name, email, phone, address, created_at FROM Clients WHERE id = ?',
      [id]
    );
    return clients[0] || null;
  }

  static async findAll() {
    const [clients] = await pool.execute(
      'SELECT id, name, email, phone, address, created_at FROM Clients ORDER BY created_at DESC'
    );
    return clients;
  }

  static async count() {
    const [result] = await pool.execute('SELECT COUNT(*) as total FROM Clients');
    return result[0].total;
  }

  static async emailExists(email) {
    const [result] = await pool.execute(
      'SELECT COUNT(*) as count FROM Clients WHERE email = ?',
      [email.toLowerCase()]
    );
    return result[0].count > 0;
  }
}

module.exports = Client;

