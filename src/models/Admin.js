const pool = require('../config/database');

class Admin {
  static async findByEmail(email) {
    const [admins] = await pool.execute(
      'SELECT * FROM Admins WHERE email = ? AND is_active = TRUE',
      [email.toLowerCase()]
    );
    return admins[0] || null;
  }

  static async findById(id) {
    const [admins] = await pool.execute(
      'SELECT id, name, email, phone, role FROM Admins WHERE id = ? AND is_active = TRUE',
      [id]
    );
    return admins[0] || null;
  }

  static async logAction(adminId, action, details, ipAddress) {
    await pool.execute(
      'INSERT INTO Admin_Logs (admin_id, action, details, ip_address) VALUES (?, ?, ?, ?)',
      [adminId, action, JSON.stringify(details), ipAddress]
    );
  }
}

module.exports = Admin;

