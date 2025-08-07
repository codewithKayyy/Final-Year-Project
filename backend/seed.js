const pool = require('./src/config/db');

async function seed() {
    try {
        await pool.query('INSERT INTO campaigns (name, status, type, progress, click_rate, report_rate) VALUES (?, ?, ?, ?, ?, ?)',
            ['Q4 Finance Department Training', 'ACTIVE', 'Email Phishing', 10/101, 22.8, 14.9]);
        console.log('Data seeded');
    } catch (err) {
        console.log(err);
    } finally {
        await pool.end();
    }
}

seed();