class ValidationError extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.name = "ValidationError";
        this.statusCode = statusCode;
    }
}

// -----------------------------
// Validate Staff Data
// -----------------------------
const validateStaffInput = (data, isEdit = false) => {
    const { id, name, email, college, role, risk } = data;

    if (!isEdit && !id) {
        throw new ValidationError("Staff ID is required.");
    }
    if (!name) {
        throw new ValidationError("Name is required.");
    }
    if (!email) {
        throw new ValidationError("Email is required.");
    }
    if (!college) {
        throw new ValidationError("College is required.");
    }
    if (!role) {
        throw new ValidationError("Role is required.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new ValidationError("Invalid email format.");
    }

    const validColleges = ["Humanities", "Health Sciences", "Basic and Applied Science", "Education"];
    if (!validColleges.includes(college)) {
        throw new ValidationError(`Invalid college. Must be one of: ${validColleges.join(", ")}.`);
    }

    const validRiskLevels = ["Low", "Medium", "High"];
    if (risk && !validRiskLevels.includes(risk)) {
        throw new ValidationError(`Invalid risk level. Must be one of: ${validRiskLevels.join(", ")}.`);
    }
};

// -----------------------------
// Validate Simulation CRUD Data
// -----------------------------
const validateSimulationData = (data, isEdit = false) => {
    const { name, targetStaffId, status } = data;

    if (!isEdit && !name) {
        throw new ValidationError("Simulation name is required.");
    }
    if (!isEdit && !targetStaffId) {
        throw new ValidationError("Target staff ID is required.");
    }

    const validStatuses = ["pending", "running", "completed", "failed"];
    if (status && !validStatuses.includes(status)) {
        throw new ValidationError(`Invalid simulation status. Must be one of: ${validStatuses.join(", ")}`);
    }
};

// -----------------------------
// Validate Start Simulation Request
// -----------------------------
const validateSimulationStartData = (data) => {
    const { name, targetStaffId, attackScriptId } = data;

    if (!name) {
        throw new ValidationError("Simulation name is required to start.");
    }
    if (!targetStaffId) {
        throw new ValidationError("Target staff ID is required.");
    }
    if (!attackScriptId) {
        throw new ValidationError("Attack script ID is required.");
    }
};

// -----------------------------
// Validate Attack Log Data (Webhook)
// -----------------------------
const validateAttackLogData = (data) => {
    const { simulationId, agentId, scriptId, status } = data;

    if (!simulationId) {
        throw new ValidationError("simulationId is required in attack log.");
    }
    if (!agentId) {
        throw new ValidationError("agentId is required in attack log.");
    }
    if (!scriptId) {
        throw new ValidationError("scriptId is required in attack log.");
    }
    if (!status) {
        throw new ValidationError("status is required in attack log.");
    }

    const validStatuses = ["pending", "running", "completed", "failed"];
    if (!validStatuses.includes(status)) {
        throw new ValidationError(`Invalid status. Must be one of: ${validStatuses.join(", ")}`);
    }
};

module.exports = {
    ValidationError,
    validateStaffInput,
    validateSimulationData,
    validateSimulationStartData,
    validateAttackLogData
};
