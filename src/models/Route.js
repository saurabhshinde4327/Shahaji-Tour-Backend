const pool = require('../config/database');
const constants = require('../constants');

class Route {
  static async create(data) {
    const { from, to, price, duration, timings, stops, seater_price, sleeper_price } = data;
    const timingsString = Array.isArray(timings) ? timings.join(',') : timings;
    const stopsString = stops ? (Array.isArray(stops) ? stops.join('|') : stops) : '';
    const seaterPrice = seater_price || constants.DEFAULT_PRICES.SEATER;
    const sleeperPrice = sleeper_price || constants.DEFAULT_PRICES.SLEEPER;

    const [result] = await pool.execute(
      'INSERT INTO Routes (from_location, to_location, price, seater_price, sleeper_price, duration, timings, stops) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [from, to, price, seaterPrice, sleeperPrice, duration, timingsString, stopsString]
    );
    return result.insertId;
  }

  static async findAll() {
    const [routes] = await pool.execute('SELECT * FROM Routes ORDER BY created_at DESC');
    return routes.map(route => this.formatRoute(route));
  }

  static async findById(id) {
    const [routes] = await pool.execute('SELECT * FROM Routes WHERE id = ?', [id]);
    return routes[0] ? this.formatRoute(routes[0]) : null;
  }

  static async findByLocations(from, to) {
    const [routes] = await pool.execute(
      'SELECT * FROM Routes WHERE from_location = ? AND to_location = ?',
      [from, to]
    );
    return routes.length > 0 ? this.formatRoute(routes[0]) : null;
  }

  static async update(id, data) {
    const { from, to, price, duration, timings, stops, seater_price, sleeper_price } = data;
    const timingsString = Array.isArray(timings) ? timings.join(',') : timings;
    const stopsString = stops ? (Array.isArray(stops) ? stops.join('|') : stops) : '';

    let updateFields = 'from_location = ?, to_location = ?, price = ?, duration = ?, timings = ?, stops = ?';
    let updateValues = [from, to, price, duration, timingsString, stopsString];

    if (seater_price !== undefined) {
      updateFields += ', seater_price = ?';
      updateValues.push(seater_price);
    }

    if (sleeper_price !== undefined) {
      updateFields += ', sleeper_price = ?';
      updateValues.push(sleeper_price);
    }

    updateValues.push(id);

    const [result] = await pool.execute(
      `UPDATE Routes SET ${updateFields} WHERE id = ?`,
      updateValues
    );
    return result.affectedRows > 0;
  }

  static async updatePrices(id, seater_price, sleeper_price) {
    const [result] = await pool.execute(
      'UPDATE Routes SET seater_price = ?, sleeper_price = ? WHERE id = ?',
      [seater_price, sleeper_price, id]
    );
    return result.affectedRows > 0;
  }

  static async updateDestination(id, from, to) {
    const [result] = await pool.execute(
      'UPDATE Routes SET from_location = ?, to_location = ? WHERE id = ?',
      [from, to, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.execute('DELETE FROM Routes WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async count() {
    const [result] = await pool.execute('SELECT COUNT(*) as total FROM Routes');
    return result[0].total;
  }

  static formatRoute(route) {
    const seaterPrice = route.seater_price != null ? parseFloat(route.seater_price) : constants.DEFAULT_PRICES.SEATER;
    const sleeperPrice = route.sleeper_price != null ? parseFloat(route.sleeper_price) : constants.DEFAULT_PRICES.SLEEPER;

    return {
      id: route.id,
      from: route.from_location,
      to: route.to_location,
      price: `₹${route.price}`,
      seater_price: seaterPrice.toString(),
      sleeper_price: sleeperPrice.toString(),
      duration: route.duration,
      times: route.timings ? route.timings.split(',') : [],
      stops: route.stops && route.stops.length > 0 ? route.stops.split('|') : []
    };
  }
}

module.exports = Route;

