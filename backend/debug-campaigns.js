const db = require('./src/config/db');

async function debugCampaigns() {
    try {
        console.log('=== DEBUGGING CAMPAIGNS ===');

        // Check table structure
        console.log('\n1. Checking table structure:');
        const [structure] = await db.execute('DESCRIBE campaigns');
        console.log('Table structure:', structure);

        // Try a simple insert with minimal data
        console.log('\n2. Testing simple insert:');
        const insertQuery = `INSERT INTO campaigns (name, type, status, created_by) VALUES (?, ?, ?, ?)`;
        const [result] = await db.execute(insertQuery, ['Debug Campaign', 'phishing', 'draft', 1]);
        console.log('Insert result:', result);

        // Check current campaigns
        console.log('\n3. Current campaigns:');
        const [campaigns] = await db.execute('SELECT * FROM campaigns');
        console.log('Campaigns:', campaigns);

        process.exit(0);
    } catch (error) {
        console.error('Debug error:', error);
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        console.error('SQL state:', error.sqlState);
        process.exit(1);
    }
}

debugCampaigns();