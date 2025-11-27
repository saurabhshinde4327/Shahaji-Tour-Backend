const Admin = require('../models/Admin');
const Client = require('../models/Client');
const Route = require('../models/Route');
const Booking = require('../models/Booking');
const Transaction = require('../models/Transaction');
const logger = require('../utils/logger');

class AdminService {
  static async login(email, password, ipAddress) {
    const admin = await Admin.findByEmail(email);
    
    if (!admin || admin.password !== password) {
      throw new Error('Invalid email or password');
    }

    // Log admin action
    await Admin.logAction(admin.id, 'login', { email: email.toLowerCase() }, ipAddress);
    
    logger.success(`Admin login successful: ${email}`);
    return {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      role: admin.role
    };
  }

  static async getDashboardStats() {
    const [
      totalClients,
      totalRoutes,
      totalBookings,
      totalRevenue,
      pendingBookings,
      todayBookings
    ] = await Promise.all([
      Client.count(),
      Route.count(),
      Booking.count(),
      Transaction.getTotalRevenue(),
      Booking.countByStatus('pending'),
      Booking.countToday()
    ]);

    return {
      totalClients,
      totalRoutes,
      totalBookings,
      totalRevenue: totalRevenue || 0,
      pendingBookings,
      todayBookings
    };
  }

  static async getAllClients() {
    return await Client.findAll();
  }

  static async getAllBookings(filters = {}) {
    return await Booking.findAll(filters);
  }
}

module.exports = AdminService;

