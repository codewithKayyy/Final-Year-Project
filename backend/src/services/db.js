// backend/src/services/db.js
const mysql = require("mysql2/promise");

// Create a connection pool for MySQL
const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
<<<<<<< HEAD
    //port: Number(process.env.DB_PORT || 3306),
=======
>>>>>>> origin/main
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "#2003Hero#",
    database: process.env.DB_NAME || "cybersecurity",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

/**
 * Get a pooled connection (optional helper)
 */
async function getConnection() {
    return pool.getConnection();
}

/**
 * Execute a query directly using the pool
 * @param {string} sql - SQL query
 * @param {Array} params - Query parameters
 */
async function query(sql, params) {
    const [rows] = await pool.execute(sql, params);
    return rows;
}

module.exports = {
    pool,
    query,
    getConnection
};
