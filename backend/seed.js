// Adjust the path depending on where your db.js lives
const pool = require('./src/config/db');

async function seed() {
    try {
        const campaigns = [
            ["Q4 Finance Training", "ACTIVE", "Email Phishing", 10, 22.8, 14.9],
            ["Q1 HR Awareness", "COMPLETED", "Spear Phishing", 100, 30.2, 12.5],
            ["Q2 IT Security", "ACTIVE", "Malware Simulation", 45, 18.9, 9.4],
            ["Q3 Staff Refresher", "ACTIVE", "Social Engineering", 0, 0.0, 0.0] // ✅ changed PENDING → ACTIVE
        ];

        await pool.query(
            `INSERT INTO campaigns 
                (name, status, type, progress, click_rate, report_rate) 
             VALUES ?`,
            [campaigns]
        );

        console.log('✅ Multiple campaigns seeded successfully');
    } catch (err) {
        console.error('❌ Error seeding data:', err);
    } finally {
        await pool.end();
    }
}

seed();