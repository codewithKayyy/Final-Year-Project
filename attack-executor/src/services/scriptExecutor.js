const { exec } = require("child_process");
const path = require("path");
require("dotenv").config();

const ATTACK_SCRIPTS_BASE_PATH = path.join(__dirname, "..", process.env.ATTACK_SCRIPTS_PATH || "./scripts");

/**
 * Executes an attack script in a Docker container.
 * @param {string} scriptId - The ID of the script to execute (e.g., 'python_email_spoof').
 * @param {object} params - Parameters to pass to the script.
 * @returns {Promise<object>} - Resolves with script output (stdout, stderr) or rejects with an error.
 */
const executeScriptInDocker = (scriptId, params) => {
    return new Promise((resolve, reject) => {
        const scriptPath = path.join(ATTACK_SCRIPTS_BASE_PATH, scriptId);

        // Basic validation for scriptId to prevent path traversal
        if (!scriptId || scriptId.includes("..") || scriptId.includes("/")) {
            return reject(new Error("Invalid scriptId provided."));
        }

        // Build Docker image if not exists (or ensure it's built)
        // In a real scenario, you'd pre-build images or use a more robust image management.
        // For simplicity, we assume Dockerfile exists in scriptPath
        const imageName = `attack-script-${scriptId.toLowerCase()}`;
        const buildCommand = `docker build -t ${imageName} ${scriptPath}`;

        exec(buildCommand, (buildError, buildStdout, buildStderr) => {
            if (buildError) {
                console.error(`Docker build error for ${scriptId}:`, buildStderr);
                return reject(new Error(`Failed to build Docker image for ${scriptId}: ${buildStderr}`));
            }
            console.log(`Docker image ${imageName} built successfully.`);

            // Convert params object to environment variables for the Docker container
            const envVars = Object.keys(params).map(key => `-e ${key.toUpperCase()}="${params[key]}"`).join(" ");

            // Construct the Docker run command
            // IMPORTANT: This is a simplified example. In production, implement robust security:
            // - Use --network none or specific bridge networks
            // - Use --read-only for filesystem
            // - Use --cap-drop ALL
            // - Use --security-opt=no-new-privileges
            // - Set resource limits (--memory, --cpus)
            // - Run as non-root user inside container (USER instruction in Dockerfile)
            const runCommand = `docker run --rm ${envVars} ${imageName}`;

            console.log(`Executing Docker command: ${runCommand}`);

            exec(runCommand, { timeout: 300000 }, (runError, stdout, stderr) => { // 5 minute timeout
                if (runError) {
                    console.error(`Docker run error for ${scriptId}:`, stderr);
                    return reject(new Error(`Script execution failed for ${scriptId}: ${stderr}`));
                }
                console.log(`Script ${scriptId} executed successfully.`);
                resolve({ stdout, stderr });
            });
        });
    });
};

module.exports = { executeScriptInDocker };