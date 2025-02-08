import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Create Profile
app.post("/api/create-profile", async (req, res) => {
  const { name, password, type, date } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      "INSERT INTO aircraft_profiles (name, password, type, date) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, hashedPassword, type, date]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  const { name, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM aircraft_profiles WHERE name = $1", [name]);
    if (result.rows.length === 0) return res.status(401).json({ error: "User not found" });

    const validPassword = await bcrypt.compare(password, result.rows[0].password);
    if (!validPassword) return res.status(401).json({ error: "Invalid password" });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
