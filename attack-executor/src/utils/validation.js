class AttackValidationError extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.name = "AttackValidationError";
        this.statusCode = statusCode;
    }
}

const validateAttackRequest = (data) => {
    const { scriptId, params, simulationId } = data;

    if (!scriptId) {
        throw new AttackValidationError("scriptId is required.");
    }
    if (typeof scriptId !== "string" || scriptId.includes("..") || scriptId.includes("/")) {
        throw new AttackValidationError("Invalid scriptId format.");
    }
    if (!params || typeof params !== "object") {
        throw new AttackValidationError("params object is required.");
    }
    if (!simulationId) {
        throw new AttackValidationError("simulationId is required.");
    }
    // Add more specific validation for params based on expected script inputs
};

module.exports = { AttackValidationError, validateAttackRequest };