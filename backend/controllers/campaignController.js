const pool = require('../config/db');

exports.getOverview = async (req, res) => {
    try {
        const [staff] = await pool.query('SELECT COUNT(*) as total FROM staff'); // Assume a staff table
        const [campaigns] = await pool.query('SELECT COUNT(*) as total FROM campaigns WHERE status = ?', ['ACTIVE']);
        const [clickRate] = await pool.query('SELECT AVG(click_rate) as avgClick FROM campaigns');
        res.json({
            totalStaff: staff[0].total || 232,
            activeCampaigns: campaigns[0].total,
            avgClickRate: clickRate[0].avgClick || 0
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCampaigns = async (req, res) => {
    try {
        const [campaigns] = await pool.query('SELECT * FROM campaigns');
        res.json(campaigns);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};