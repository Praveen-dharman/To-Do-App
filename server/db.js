const mysql = require('mysql2');

// Create a connection pool (better than single connection for production)
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // Replace with your MySQL username
  password: 'prvn', // Replace with your MySQL password
  database: 'task_of_the_day',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Verify connection on startup
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
  connection.release(); // Release the connection back to the pool
});

// Export the pool for use in other files
module.exports = pool.promise(); // Using promise wrapper for async/await