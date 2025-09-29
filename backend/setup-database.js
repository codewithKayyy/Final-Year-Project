const mysql = require("mysql2");
require("dotenv").config();
const fs = require('fs');

async function setupDatabase() {
    // First create database
    const connection = mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '#2003Hero#'
    });

    try {
        // Create database if it doesn't exist
        await connection.promise().query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'cybersecurity'}`);
        console.log('Database created/verified');
        connection.end();

        // Now connect to the specific database
        const dbConnection = mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '#2003Hero#',
            database: process.env.DB_NAME || 'cybersecurity'
        });

        // Read and execute schema
        const schema = fs.readFileSync('../DATABASE_SCHEMA.sql', 'utf8');

        // Split by semicolon and execute each statement
        const statements = schema.split(';').filter(stmt => stmt.trim().length > 0);

        for (const statement of statements) {
            try {
                await dbConnection.promise().query(statement);
                console.log('Executed statement successfully');
            } catch (err) {
                if (err.message.includes('already exists')) {
                    console.log('Table/view already exists, skipping...');
                } else {
                    console.error('Error executing statement:', err.message);
                }
            }
        }

        console.log('Database setup completed successfully');
        dbConnection.end();

    } catch (error) {
        console.error('Database setup failed:', error);
    }
}

setupDatabase();