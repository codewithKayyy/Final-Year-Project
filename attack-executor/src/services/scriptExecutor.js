const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const ATTACK_SCRIPTS_BASE_PATH = path.join(__dirname, "..", process.env.ATTACK_SCRIPTS_PATH || "./scripts");

const executeScriptInDocker = (scriptId, params) => {
    return new Promise((resolve, reject) => {
        const scriptPath = path.join(ATTACK_SCRIPTS_BASE_PATH, scriptId);

        if (!scriptId || scriptId.includes("..") || scriptId.includes("/")) {
            return reject(new Error("Invalid scriptId provided."));
        }

        // Convert all params to environment variables
        const envVars = Object.keys(params).map(key => {
            let value = params[key];
            if (typeof value === 'object') {
                value = JSON.stringify(value);
            }
            return `-e ${key.toUpperCase()}="${value}"`;
        }).join(" ");

        const imageName = `attack-script-${scriptId.toLowerCase()}`;
        const buildCommand = `docker build -t ${imageName} ${scriptPath}`;

        exec(buildCommand, (buildError, buildStdout, buildStderr) => {
            if (buildError) {
                console.error(`Docker build error for ${scriptId}:`, buildStderr);
                return reject(new Error(`Failed to build Docker image for ${scriptId}: ${buildStderr}`));
            }

            const runCommand = `docker run --rm ${envVars} ${imageName}`;
            console.log(`Executing Docker command: ${runCommand}`);

            exec(runCommand, { timeout: 300000 }, (runError, stdout, stderr) => {
                if (runError) {
                    console.error(`Docker run error for ${scriptId}:`, stderr);
                    return reject(new Error(`Script execution failed for ${scriptId}: ${stderr}`));
                }
                resolve({ stdout, stderr });
            });
        });
    });
};

module.exports = { executeScriptInDocker };