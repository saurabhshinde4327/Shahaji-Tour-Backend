const pool = require('../config/database');

class SliderImage {
  static async create(data) {
    const { image_url, title, description, display_order, is_active } = data;
    const [result] = await pool.execute(
      `INSERT INTO slider_images (image_url, title, description, display_order, is_active, created_at) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [image_url, title || null, description || null, display_order || 0, is_active !== undefined ? is_active : 1]
    );
    return result.insertId;
  }

  static async findAll() {
    const [rows] = await pool.execute(
      `SELECT * FROM slider_images ORDER BY display_order ASC, created_at DESC`
    );
    return rows;
  }

  static async findActive() {
    const [rows] = await pool.execute(
      `SELECT * FROM slider_images WHERE is_active = 1 ORDER BY display_order ASC, created_at DESC`
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT * FROM slider_images WHERE id = ?`,
      [id]
    );
    return rows[0] || null;
  }

  static async update(id, data) {
    const { image_url, title, description, display_order, is_active } = data;
    const updates = [];
    const values = [];

    if (image_url !== undefined) {
      updates.push('image_url = ?');
      values.push(image_url);
    }
    if (title !== undefined) {
      updates.push('title = ?');
      values.push(title);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    if (display_order !== undefined) {
      updates.push('display_order = ?');
      values.push(display_order);
    }
    if (is_active !== undefined) {
      updates.push('is_active = ?');
      values.push(is_active);
    }

    if (updates.length === 0) {
      return false;
    }

    updates.push('updated_at = NOW()');
    values.push(id);

    const [result] = await pool.execute(
      `UPDATE slider_images SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.execute(
      `DELETE FROM slider_images WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = SliderImage;

