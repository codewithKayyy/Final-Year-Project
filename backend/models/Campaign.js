const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
    name: String,
    status: { type: String, enum: ['ACTIVE', 'COMPLETED', 'SCHEDULED', 'DRAFT'] },
    type: String,
    progress: Number,
    clickRate: Number,
    reportRate: Number,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Campaign', campaignSchema);