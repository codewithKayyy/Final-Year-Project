require('dotenv').config();
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '#2003Hero#',
    database: process.env.DB_NAME || 'cybersecurity',
});

db.connect((err) => {
    if (err) {
        console.error('MySQL connection failed:', err);
    } else {
        console.log('MySQL connected');
    }
});

module.exports = db;
