const pool = require('../config/database');

class Booking {
  static async create(data) {
    const { client_id, route_id, travel_date, travel_time, num_passengers, seats, total_amount } = data;
    const seatsString = Array.isArray(seats) ? seats.join(',') : seats || '';

    const [result] = await pool.execute(
      `INSERT INTO Bookings 
       (client_id, route_id, booking_date, travel_date, travel_time, num_passengers, seats, total_amount, status, payment_status) 
       VALUES (?, ?, CURDATE(), ?, ?, ?, ?, ?, 'pending', 'unpaid')`,
      [client_id, route_id, travel_date, travel_time, num_passengers || 1, seatsString, total_amount]
    );
    return result.insertId;
  }

  static async findById(id) {
    const [bookings] = await pool.execute(
      'SELECT * FROM booking_details WHERE booking_id = ?',
      [id]
    );
    return bookings[0] || null;
  }

  static async findByClientId(clientId) {
    const [bookings] = await pool.execute(
      'SELECT * FROM booking_details WHERE client_id = ? ORDER BY booking_date DESC',
      [clientId]
    );
    return bookings;
  }

  static async getBookedSeats(routeId, travelDate, travelTime) {
    // Only get seats from bookings that are confirmed and paid
    // This ensures seats are marked as booked only after successful payment
    const [bookings] = await pool.execute(
      `SELECT seats FROM Bookings 
       WHERE route_id = ? 
       AND travel_date = ? 
       AND travel_time = ? 
       AND status = 'confirmed'
       AND payment_status = 'paid'
       AND seats IS NOT NULL 
       AND seats != ''`,
      [routeId, travelDate, travelTime]
    );

    const bookedSeats = [];
    bookings.forEach(booking => {
      if (booking.seats) {
        const seats = booking.seats.split(',').map(s => s.trim());
        bookedSeats.push(...seats);
      }
    });
    return bookedSeats;
  }

  static async updateStatus(id, status) {
    const [result] = await pool.execute(
      'UPDATE Bookings SET status = ? WHERE id = ?',
      [status, id]
    );
    return result.affectedRows > 0;
  }

  static async cancel(id) {
    const [result] = await pool.execute(
      'UPDATE Bookings SET status = "cancelled" WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  static async updatePaymentStatus(id, paymentStatus, bookingStatus = null) {
    let query = 'UPDATE Bookings SET payment_status = ?';
    let params = [paymentStatus];

    if (bookingStatus) {
      query += ', status = ?';
      params.push(bookingStatus);
    }

    query += ' WHERE id = ?';
    params.push(id);

    const [result] = await pool.execute(query, params);
    return result.affectedRows > 0;
  }

  static async findAll(filters = {}) {
    let query = 'SELECT * FROM booking_details';
    let params = [];
    let conditions = [];

    if (filters.status) {
      conditions.push('booking_status = ?');
      params.push(filters.status);
    }

    if (filters.from_date) {
      conditions.push('travel_date >= ?');
      params.push(filters.from_date);
    }

    if (filters.to_date) {
      conditions.push('travel_date <= ?');
      params.push(filters.to_date);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY booking_date DESC';

    const [bookings] = await pool.execute(query, params);
    return bookings;
  }

  static async count() {
    const [result] = await pool.execute('SELECT COUNT(*) as total FROM Bookings');
    return result[0].total;
  }

  static async countByStatus(status) {
    const [result] = await pool.execute(
      'SELECT COUNT(*) as total FROM Bookings WHERE status = ?',
      [status]
    );
    return result[0].total;
  }

  static async countToday() {
    const [result] = await pool.execute(
      'SELECT COUNT(*) as total FROM Bookings WHERE DATE(booking_date) = CURDATE()'
    );
    return result[0].total;
  }
}

module.exports = Booking;

