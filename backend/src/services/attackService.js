// backend/src/services/attackService.js (New Service)
const axios = require("axios");

const ATTACK_EXECUTOR_URL = process.env.ATTACK_EXECUTOR_URL || "http://localhost:5001";

const triggerAttackExecution = async (scriptId, params, simulationId, agentId) => {
    try {
        const response = await axios.post(`${ATTACK_EXECUTOR_URL}/execute`, {
            scriptId,
            params,
            simulationId,
            agentId
        });
        return response.data;
    } catch (error) {
        console.error("Error triggering attack execution:", error.response?.data || error.message);
        throw error;
    }
};

module.exports = { triggerAttackExecution };