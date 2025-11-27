const Payment = require('../models/Payment');
const Route = require('../models/Route');
const pool = require('../config/database');

class ReportService {
  static async getRevenueReport(fromDate, toDate) {
    const report = await Payment.getRevenueReport(fromDate, toDate);
    
    const totalRevenue = report.reduce((sum, row) => sum + parseFloat(row.total_revenue), 0);
    const totalTransactions = report.reduce((sum, row) => sum + parseInt(row.transaction_count), 0);

    return {
      report,
      summary: {
        totalRevenue,
        totalTransactions,
        averageTransaction: totalTransactions > 0 ? totalRevenue / totalTransactions : 0
      }
    };
  }

  static async getPopularRoutes() {
    const [routes] = await pool.execute(`
      SELECT 
        r.id,
        r.from_location,
        r.to_location,
        r.price,
        COUNT(b.id) as booking_count,
        SUM(b.total_amount) as total_revenue
      FROM Routes r
      LEFT JOIN Bookings b ON r.id = b.route_id
      GROUP BY r.id, r.from_location, r.to_location, r.price
      ORDER BY booking_count DESC
      LIMIT 10
    `);
    return routes;
  }
}

module.exports = ReportService;

