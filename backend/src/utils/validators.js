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
// Validate Campaign Data
// -----------------------------
const validateCampaignData = (data, isEdit = false) => {
    const { name, type, status } = data;

    if (!isEdit && !name) {
        throw new ValidationError("Campaign name is required.");
    }
    if (!isEdit && !type) {
        throw new ValidationError("Campaign type is required.");
    }

    const validTypes = ["phishing", "social_engineering", "malware", "mixed"];
    if (type && !validTypes.includes(type)) {
        throw new ValidationError(`Invalid campaign type. Must be one of: ${validTypes.join(", ")}`);
    }

    const validStatuses = ["draft", "scheduled", "running", "completed", "paused", "cancelled"];
    if (status && !validStatuses.includes(status)) {
        throw new ValidationError(`Invalid campaign status. Must be one of: ${validStatuses.join(", ")}`);
    }

    // Validate numeric fields
    if (data.participant_count !== undefined && (isNaN(data.participant_count) || data.participant_count < 0)) {
        throw new ValidationError("Participant count must be a non-negative number.");
    }

    if (data.click_rate !== undefined && (isNaN(data.click_rate) || data.click_rate < 0 || data.click_rate > 100)) {
        throw new ValidationError("Click rate must be a percentage between 0 and 100.");
    }

    if (data.report_rate !== undefined && (isNaN(data.report_rate) || data.report_rate < 0 || data.report_rate > 100)) {
        throw new ValidationError("Report rate must be a percentage between 0 and 100.");
    }
};

// -----------------------------
// Validate Simulation CRUD Data (UPDATED WITH CAMPAIGN SUPPORT)
// -----------------------------
const validateSimulationData = (data, isEdit = false) => {
    const { name, type, status, campaign_id } = data;

    if (!isEdit && !name) {
        throw new ValidationError("Simulation name is required.");
    }

    // targetStaffId is not required for basic simulation creation - can be configured later

    const validStatuses = ["draft", "scheduled", "running", "completed", "failed", "cancelled"];
    if (status && !validStatuses.includes(status)) {
        throw new ValidationError(`Invalid simulation status. Must be one of: ${validStatuses.join(", ")}`);
    }

    const validTypes = ["phishing", "social_engineering", "malware", "custom"];
    if (type && !validTypes.includes(type)) {
        throw new ValidationError(`Invalid simulation type. Must be one of: ${validTypes.join(", ")}`);
    }

    // campaign_id is optional but if provided, should be a positive integer
    if (campaign_id !== undefined && campaign_id !== null) {
        if (isNaN(campaign_id) || campaign_id <= 0 || !Number.isInteger(Number(campaign_id))) {
            throw new ValidationError("Campaign ID must be a positive integer.");
        }
    }
};

// -----------------------------
// Validate Start Simulation Request (UPDATED WITH CAMPAIGN SUPPORT)
// -----------------------------
const validateSimulationStartData = (data) => {
    const { name, targetStaffId, targetAgentId, attackScriptId, campaign_id } = data;

    // Name can be auto-generated if not provided
    // if (!name) {
    //     throw new ValidationError("Simulation name is required to start.");
    // }

    // At least one target should be specified
    if (!targetStaffId && !targetAgentId) {
        throw new ValidationError("Either target staff ID or target agent ID is required.");
    }

    // Attack script ID is optional, will default to 'default_phishing_script'
    // if (!attackScriptId) {
    //     throw new ValidationError("Attack script ID is required.");
    // }

    // campaign_id is optional but if provided, should be a positive integer
    if (campaign_id !== undefined && campaign_id !== null) {
        if (isNaN(campaign_id) || campaign_id <= 0 || !Number.isInteger(Number(campaign_id))) {
            throw new ValidationError("Campaign ID must be a positive integer.");
        }
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

    const validStatuses = ["draft", "scheduled", "running", "completed", "failed", "cancelled"];
    if (!validStatuses.includes(status)) {
        throw new ValidationError(`Invalid status. Must be one of: ${validStatuses.join(", ")}`);
    }
};

// -----------------------------
// Validate Phishing Email Data
// -----------------------------
const validatePhishingEmailData = (data, isEdit = false) => {
    const { campaign_id, subject, html_content, from_name, from_email, target_url } = data;

    if (!isEdit && !campaign_id) {
        throw new ValidationError("Campaign ID is required.");
    }
    if (!subject) {
        throw new ValidationError("Email subject is required.");
    }
    if (!html_content) {
        throw new ValidationError("HTML content is required.");
    }
    if (!from_name) {
        throw new ValidationError("From name is required.");
    }
    if (!from_email) {
        throw new ValidationError("From email is required.");
    }
    if (!target_url) {
        throw new ValidationError("Target URL is required.");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(from_email)) {
        throw new ValidationError("Invalid from email format.");
    }

    // Validate URL format
    const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
    if (!urlRegex.test(target_url)) {
        throw new ValidationError("Invalid target URL format.");
    }

    // campaign_id should be a positive integer
    if (campaign_id !== undefined && campaign_id !== null) {
        if (isNaN(campaign_id) || campaign_id <= 0 || !Number.isInteger(Number(campaign_id))) {
            throw new ValidationError("Campaign ID must be a positive integer.");
        }
    }
};

module.exports = {
    ValidationError,
    validateStaffInput,
    validateCampaignData,
    validateSimulationData,
    validateSimulationStartData,
    validateAttackLogData,
    validatePhishingEmailData
};