import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";
import pg from "pg";
import dotenv from "dotenv";
import multer from "multer";
import fs from "fs";
import path from "path";
import session from "express-session"; // Import express-session

dotenv.config();

const app = express();

// Set up session middleware
app.use(
  session({
    secret: "4007", // Replace with a secure secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to `true` if using HTTPS
  })
);

// Define the allowed origins and enable credentials
const corsOptions = {
  origin: 'http://localhost:3000', // Allow only the frontend's origin
  credentials: true, // Allow cookies and credentials to be sent
};

app.use(cors(corsOptions));

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
      // Fetch user details including password for authentication
      const user = await pool.query("SELECT id, name, password FROM aircraft_profiles WHERE name = $1", [name]);

      if (user.rows.length === 0) {
          return res.status(401).json({ error: "User not found" });
      }

      // Compare hashed password
      const validPassword = bcrypt.compareSync(password, user.rows[0].password);
      if (!validPassword) {
          return res.status(401).json({ error: "Invalid credentials" });
      }

      // Set aircraft profile ID in session
      req.session.aircraftId = user.rows[0].id;

      // Return the aircraft profile to the frontend
      const profile = { 
        name: user.rows[0].name,
            aircraftId: user.rows[0].id // Ensure 'id' is sent properly
      };

      console.log("Backend Profile Response:", profile); // Debugging log
      res.json(profile);
  } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
  }
});


// Ensure 'uploads' and 'documents' folders exist
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Set up multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Upload to the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to file name
  },
});

const upload = multer({ storage: storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads")); // Serve images from uploads folder

// API route to handle form submission (Post component)
app.post("/api/post-component", upload.single("image"), async (req, res) => {
  const { name, partNumber, serialNumber, comment, status, category } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null; // Get the uploaded image path

  const aircraftProfileId = req.session.aircraftId; // Get the aircraft profile ID from session

  if (!aircraftProfileId) {
    return res.status(400).json({ error: "No aircraft profile found in session" });
  }

  try {
    console.log("Received Data:", req.body); // Debugging

    const query = `
      INSERT INTO components (name, part_number, serial_number, comment, status, category, image_path, aircraft_profile_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
    const values = [name, partNumber, serialNumber, comment, status, category, imagePath, aircraftProfileId];

    const result = await pool.query(query, values);
    console.log("Post submitted:", result.rows[0]); // Log the submitted post
    res.status(201).json(result.rows[0]); // Return the created component as response
  } catch (error) {
    console.error("Error inserting component:", error);
    res.status(500).send("Error submitting post");
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
