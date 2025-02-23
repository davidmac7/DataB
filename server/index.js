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
import cookieSession from 'cookie-session';
import signatureRoutes from "./sign.js";


dotenv.config();

const app = express();


// ✅ Initialize the PostgreSQL pool BEFORE using it
const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

 // Pass 'session' to 'connect-pg-simple'

app.use(
  cookieSession({
    name: 'session',
    secret: '4006',
    maxAge: 24 * 60 * 60 * 1000,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true },
  })
);


// Define the allowed origins and enable credentials
const corsOptions = {
  origin: 'http://localhost:3000', // Allow only the frontend's origin
  credentials: true, // Allow cookies and credentials to be sent
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.static("signatures"));

// Use the imported API routes
app.use("/", signatureRoutes);

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

// API to get all components in category X for the logged-in aircraft profile
app.get("/api/get-components/X", async (req, res) => {
  // console.log("Session Data:", req.session); // Log session to check if aircraftId exists
  const aircraftProfileId = req.session.aircraftId; // Get aircraft profile ID from session

  if (!aircraftProfileId) {
    return res.status(400).json({ error: "No aircraft profile found in session" });
  }

  try {
    const query = `
      SELECT * FROM components 
      WHERE category = 'X' AND aircraft_profile_id = $1
    `;
    const values = [aircraftProfileId];

    const result = await pool.query(query, values);

    // Append full URL for images
    const components = result.rows.map((component) => ({
      ...component,
      image_url: component.image_path ? `http://localhost:5000${component.image_path}` : null,
    }));

    res.json(components); // Return all components of category X for the logged-in aircraft

  } catch (error) {
    console.error("Error fetching components:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// API to get all components in category R for the logged-in aircraft profile
app.get("/api/get-components/R", async (req, res) => {
  // console.log("Session Data:", req.session); // Log session to check if aircraftId exists
  const aircraftProfileId = req.session.aircraftId; // Get aircraft profile ID from session

  if (!aircraftProfileId) {
    return res.status(400).json({ error: "No aircraft profile found in session" });
  }

  try {
    const query = `
      SELECT * FROM components 
      WHERE category = 'R' AND aircraft_profile_id = $1
    `;
    const values = [aircraftProfileId];

    const result = await pool.query(query, values);

    // Append full URL for images
    const components = result.rows.map((component) => ({
      ...component,
      image_url: component.image_path ? `http://localhost:5000${component.image_path}` : null,
    }));

    res.json(components); // Return all components of category R for the logged-in aircraft

  } catch (error) {
    console.error("Error fetching components:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// API to get all components in category A for the logged-in aircraft profile
app.get("/api/get-components/A", async (req, res) => {
  // console.log("Session Data:", req.session); // Log session to check if aircraftId exists
  const aircraftProfileId = req.session.aircraftId; // Get aircraft profile ID from session

  if (!aircraftProfileId) {
    return res.status(400).json({ error: "No aircraft profile found in session" });
  }

  try {
    const query = `
      SELECT * FROM components 
      WHERE category = 'A' AND aircraft_profile_id = $1
    `;
    const values = [aircraftProfileId];

    const result = await pool.query(query, values);

    // Append full URL for images
    const components = result.rows.map((component) => ({
      ...component,
      image_url: component.image_path ? `http://localhost:5000${component.image_path}` : null,
    }));

    res.json(components); // Return all components of category A for the logged-in aircraft

  } catch (error) {
    console.error("Error fetching components:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.use("/uploads", express.static("uploads"));

app.get("/api/search", async (req, res) => {
  const { query, aircraftId } = req.query;
  if (!query || !aircraftId) return res.status(400).json({ error: "Missing parameters" });

  try {
    const result = await pool.query(
      `SELECT * 
       FROM components 
       WHERE aircraft_profile_id = $1 
       AND (LOWER(name) LIKE LOWER($2) OR LOWER(part_number) LIKE LOWER($2))`,
      [aircraftId, `%${query}%`]
      
    );

    // Append full URL for images
    const results = result.rows.map((item) => ({
      ...item,
      image_url: item.image_path ? `http://localhost:5000${item.image_path}` : null,
    }));
    // console.log(results);
    res.json(results);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});



app.get('/api/get-defects/:componentId', (req, res) => {
  const { componentId } = req.params;
  // Fetch defect register data for the given componentId from the database
  // Then respond with the data
});

app.post("/api/saveDefect", async (req, res) => {
  const { componentId, defects } = req.body;

  try {
        // Filter out any invalid defect data on the backend side as a precaution
        const validDefects = defects.filter(defect => defect.defectName && defect.workDate);

        // Only process defects that have valid data
        const defectPromises = validDefects.map(async (defect) => {
          const workDate = defect.workDate && defect.workDate.trim() !== "" ? defect.workDate : new Date().toISOString().split('T')[0];
    

      const query = `
        INSERT INTO defects (component_id, defect_name, elimination_method, date_work_done, performer_name, master_name, qc_name, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        RETURNING *;
      `;

      const values = [
        componentId,
        defect.defectName,
        defect.eliminationMethod,
        workDate,  // Use the updated workDate value
        defect.performerName,
        defect.masterName,
        defect.qcName,
      ];

      const res = await pool.query(query, values);
      return res.rows[0];
    });

    const savedDefects = await Promise.all(defectPromises);

    res.status(200).json({
      message: "Defects saved successfully.",
      defects: savedDefects,
    });
  } catch (error) {
    console.error("Error saving defects:", error);
    res.status(500).json({ message: "Failed to save defects." });
  }
});



app.listen(5000, () => console.log("Server running on port 5000"));