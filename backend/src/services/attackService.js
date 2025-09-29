// backend/src/services/attackService.js
const axios = require("axios");

const ATTACK_EXECUTOR_URL = process.env.ATTACK_EXECUTOR_URL || "http://localhost:5001";

/**
 * Trigger attack execution via HTTP call to attack-executor service
 * @param {string} scriptId - Attack script identifier
 * @param {object} params - Parameters for the attack
 * @param {number} simulationId - Simulation record ID
 * @param {number} agentId - Target agent ID (or staff ID fallback)
 * @param {number|null} emailTemplateId - Optional email template ID
 */
const triggerAttackExecution = async (
    scriptId,
    params,
    simulationId,
    agentId,
    emailTemplateId = null
) => {
    try {
        const response = await axios.post(
            `${ATTACK_EXECUTOR_URL}/execute`,
            {
                scriptId,
                params,
                simulationId,
                agentId,
                emailTemplateId,
            },
            {
                timeout: 10000,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        console.log(
            `🚀 Attack execution requested: script=${scriptId}, simulation=${simulationId}, agent=${agentId}`
        );
        return response.data;
    } catch (error) {
        console.error(
            "❌ Failed to trigger attack execution:",
            error.response?.data || error.message
        );
        throw new Error(`Attack executor service unavailable: ${error.message}`);
    }
};

module.exports = { triggerAttackExecution };
