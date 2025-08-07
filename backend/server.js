require("dotenv").config(); // Load environment variables from .env file
const app = require("./src/app");

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
    console.log(`Access it at http://localhost:${PORT}`);
});