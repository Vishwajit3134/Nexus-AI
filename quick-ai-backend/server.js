// --- Import Dependencies ---
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
// Note: We don't need 'pool' here anymore, as it's used in the route files
const toolRoutes = require("./routes/toolRoutes");
const userRoutes = require("./routes/userRoutes");

dotenv.config();

// --- App Setup ---
const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- API Routes ---
// Any URL starting with /api/tools will be handled by toolRoutes.js
app.use("/api/tools", toolRoutes);

// Any URL starting with /api/users will be handled by userRoutes.js
// Note: This means your frontend call must change from /api/saveUser to /api/users/saveUser
app.use("/api/users", userRoutes);

// --- Test Route ---
app.get("/", (req, res) => {
  res.send("🚀 QuickAI Backend is Live!");
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🔥 Backend running at http://localhost:${PORT}`);
});
