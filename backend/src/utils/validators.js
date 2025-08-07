class ValidationError extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.name = "ValidationError";
        this.statusCode = statusCode;
    }
}

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

module.exports = { ValidationError, validateStaffInput };