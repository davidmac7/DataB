import express from "express";
import pg from "pg";
import bcrypt from "bcryptjs";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 5000;

// PostgreSQL Database Connection
const db = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "m1a2k3a4k5a6", // Change this to your actual password
  port: 5432,
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// 🔹 Register (Create Account)
app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    const userCheck = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert into users table
    await db.query("INSERT INTO users (email, password) VALUES ($1, $2)", [email, hashedPassword]);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔹 Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user
    const userResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = userResult.rows[0];

    // Compare hashed passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Start Server
app.listen(5000, () => console.log(`Server running on port 5000`));
