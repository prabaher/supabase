
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();

// Railway provides PORT automatically.
const PORT = process.env.PORT || 3000;

// ===== 1. Validate environment variables =====
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "ERROR: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing."
  );
  process.exit(1);
}

// ===== 2. Connect to Supabase =====
const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY
);

// ===== 3. Middleware =====
app.use(
  cors({
    origin: [
      "https://supabase-frontend-five.vercel.app",
      "http://localhost:5500",
      "http://127.0.0.1:5500"
    ],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json());

// ===== 4. Root route =====
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Student Feedback Backend is running!"
  });
});

// ===== 5. Health check =====
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is healthy"
  });
});

// ===== 6. API test route =====
app.get("/api/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Submissions API is available"
  });
});

// ===== 7. Save submission to Supabase =====
app.post("/api/submissions", async (req, res) => {
  try {
    const { name, email, message } = req.body || {};

    // Validate input
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof message !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required."
      });
    }

    console.log("Received submission:", {
      name: name.trim(),
      email: email.trim()
    });

    // Insert data into Supabase
    const { data, error } = await supabase
      .from("submissions")
      .insert([
        {
          name: name.trim(),
          email: email.trim(),
          message: message.trim()
        }
      ])
      .select("id, name, email, message, created_at")
      .single();

    if (error) {
      console.error("Supabase insert error:", error.message);

      return res.status(500).json({
        success: false,
        message: "Failed to save submission to the database."
      });
    }

    console.log("Submission saved successfully:", data.id);

    return res.status(201).json({
      success: true,
      message: "Submission saved successfully",
      data
    });
  } catch (error) {
    console.error("Submission error:", error);

    return res.status(500).json({
      success: false,
      message: "An unexpected server error occurred."
    });
  }
});

// ===== 8. Handle unknown routes =====
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// ===== 9. Handle invalid JSON =====
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON request body."
    });
  }

  console.error("Server error:", err);

  return res.status(500).json({
    success: false,
    message: "Internal server error."
  });
});

// ===== 10. Start server =====
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on port ${PORT}`);
});