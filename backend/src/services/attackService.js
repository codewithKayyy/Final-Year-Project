<<<<<<< HEAD
// backend/src/services/attackService.js
const axios = require('axios');

const ATTACK_EXECUTOR_URL = process.env.ATTACK_EXECUTOR_URL || 'http://localhost:5001';

/**
 * Trigger attack execution via HTTP call to attack-executor service
 */
const triggerAttackExecution = async (scriptId, params, simulationId, agentId, emailTemplateId = null) => {
=======
// backend/src/services/attackService.js (New Service)
const axios = require("axios");

const ATTACK_EXECUTOR_URL = process.env.ATTACK_EXECUTOR_URL || "http://localhost:5001";

const triggerAttackExecution = async (scriptId, params, simulationId, agentId) => {
>>>>>>> origin/main
    try {
        const response = await axios.post(`${ATTACK_EXECUTOR_URL}/execute`, {
            scriptId,
            params,
            simulationId,
<<<<<<< HEAD
            agentId,
            emailTemplateId
        }, {
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log(`Attack execution requested for script ${scriptId} (simulation: ${simulationId}, agent: ${agentId})`);
        return response.data;
    } catch (error) {
        console.error(`Failed to trigger attack execution:`, error.message);
        throw new Error(`Attack executor service unavailable: ${error.message}`);
    }
};

module.exports = { triggerAttackExecution };
=======
            agentId
        });
        return response.data;
    } catch (error) {
        console.error("Error triggering attack execution:", error.response?.data || error.message);
        throw error;
    }
};

module.exports = { triggerAttackExecution };
>>>>>>> origin/main
