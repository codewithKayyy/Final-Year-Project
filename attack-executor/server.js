// attack-executor/server.js
require("dotenv").config();
const app = require("./src/app");
const { addAttackJob } = require("./src/jobs/attackExecutionJob"); // Ensure worker is initialized

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Attack Executor Service running on port ${PORT}`);
    console.log(`Access it at http://localhost:${PORT}`);
});