const mysql = require('mysql2/promise');
const config = require('./index');

// Create MySQL connection pool
const pool = mysql.createPool(config.db);

// Test database connection
pool.getConnection()
  .then(connection => {
    console.log('✅ Connected to MariaDB database successfully!');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Error connecting to MariaDB:', err.message);
  });

module.exports = pool;

