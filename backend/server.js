const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const { protect } = require("./middleware/auth");

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Public routes
app.use("/api/auth", require("./routes/authRoutes"));

// Protected routes
app.use("/api/students", protect, require("./routes/studentRoutes"));
app.use("/api/courses", protect, require("./routes/courseRoutes"));
app.use("/api/analytics", protect, require("./routes/analyticsRoutes"));

// Health check route
app.get("/", (req, res) => {
    res.json({ message: "Student Enrollment API is running" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
