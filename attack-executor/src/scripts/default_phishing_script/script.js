#!/usr/bin/env node

const axios = require('axios');

// Get environment variables
const simulationId = process.env.SIMULATION_ID;
const agentId = process.env.AGENT_ID;
const staffId = process.env.STAFF_ID;
const webhookUrl = process.env.WEBHOOK_URL;

console.log(`🎣 Default Phishing Script Starting`);
console.log(`Simulation ID: ${simulationId}`);
console.log(`Agent ID: ${agentId}`);
console.log(`Staff ID: ${staffId}`);

async function runPhishingSimulation() {
    try {
        console.log(`📧 Simulating phishing email attack...`);

        // Simulate some processing time
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simulate phishing email metrics
        const results = {
            emailsSent: 1,
            emailsOpened: Math.random() > 0.5 ? 1 : 0,
            linksClicked: Math.random() > 0.7 ? 1 : 0,
            credentialsEntered: Math.random() > 0.9 ? 1 : 0,
            timestamp: new Date().toISOString()
        };

        console.log(`📊 Simulation Results:`, results);

        // Determine success based on whether target fell for the phishing
        const success = results.linksClicked > 0 || results.credentialsEntered > 0;

        // Send results back to the main system
        if (webhookUrl) {
            try {
                await axios.post(webhookUrl, {
                    simulationId,
                    agentId,
                    staffId,
                    outcome: success ? 'success' : 'failed',
                    results,
                    details: success ? 'Target fell for phishing attempt' : 'Target did not fall for phishing attempt'
                });
                console.log('✅ Results sent to webhook successfully');
            } catch (webhookError) {
                console.error('❌ Failed to send webhook:', webhookError.message);
            }
        }

        console.log(`🎯 Phishing simulation ${success ? 'SUCCESSFUL' : 'FAILED'}`);
        process.exit(success ? 0 : 1);

    } catch (error) {
        console.error('❌ Simulation failed:', error.message);

        // Send failure notification
        if (webhookUrl) {
            try {
                await axios.post(webhookUrl, {
                    simulationId,
                    agentId,
                    staffId,
                    outcome: 'error',
                    details: error.message
                });
            } catch (webhookError) {
                console.error('❌ Failed to send failure webhook:', webhookError.message);
            }
        }

        process.exit(1);
    }
}

runPhishingSimulation();