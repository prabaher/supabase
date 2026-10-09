const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");

const app = express();

const PORT = process.env.PORT || 3000;

// Create Supabase client
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Middleware
app.use(cors({
    origin: "https://supabase-frontend-five.vercel.app"
}));
app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Student Feedback Backend is running!"
    });
});

// Test route
app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "API is working correctly!"
    });
});

// CREATE submission
app.post("/api/submissions", async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Basic validation
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "Name, email and message are required"
            });
        }

        const { data, error } = await supabase
            .from("submissions")
            .insert([
                {
                    name,
                    email,
                    message
                }
            ])
            .select()
            .single();

        if (error) {
            console.error("Supabase error:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to save submission"
            });
        }

        res.status(201).json({
            success: true,
            message: "Submission saved successfully",
            data
        });

    } catch (error) {
        console.error("Server error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is healthy"
  });
});
// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});