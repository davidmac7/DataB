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
import { fileURLToPath } from "url";
import { uploads } from './upload.js'; // Import the multer upload from upload.js



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

// Allow requests from multiple frontend ports
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3003",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies & authentication headers
  })
);


app.use(bodyParser.json());
app.use(express.static("signatures"));
app.use("/signatures", express.static(path.join(process.cwd(), "signatures")));



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

app.get("/api/X/search", async (req, res) => {
  const { query, aircraftId } = req.query;
  if (!query || !aircraftId) return res.status(400).json({ error: "Missing parameters" });

  try {
    const result = await pool.query(
      `SELECT * 
       FROM components 
       WHERE aircraft_profile_id = $1 
       AND category = 'X'  -- Only select from category X
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

app.get("/api/R/search", async (req, res) => {
  const { query, aircraftId } = req.query;
  if (!query || !aircraftId) return res.status(400).json({ error: "Missing parameters" });

  try {
    const result = await pool.query(
      `SELECT * 
       FROM components 
       WHERE aircraft_profile_id = $1 
       AND category = 'R'  -- Only select from category X
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

app.get("/api/A/search", async (req, res) => {
  const { query, aircraftId } = req.query;
  if (!query || !aircraftId) return res.status(400).json({ error: "Missing parameters" });

  try {
    const result = await pool.query(
      `SELECT * 
       FROM components 
       WHERE aircraft_profile_id = $1 
       AND category = 'A'  -- Only select from category X
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
    // Filter valid defects
    const validDefects = defects.filter(defect => defect.defectName && defect.workDate);

    const defectPromises = validDefects.map(async (defect) => {
      const workDate = defect.workDate.trim() !== "" ? defect.workDate : new Date().toISOString().split('T')[0];

      const query = `
        INSERT INTO defects (component_id, defect_name, elimination_method, date_work_done, performer_name, master_name, qc_name, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        RETURNING *;
      `;

      const values = [
        componentId,
        defect.defectName,
        defect.eliminationMethod,
        workDate,
        defect.performerName,
        defect.masterName,
        defect.qcName,
      ];

      const result = await pool.query(query, values);
      return result.rows[0];
    });

    await Promise.all(defectPromises);



    res.status(200).json({
      message: "Defects saved successfully and marked as submitted.",
    });
  } catch (error) {
    console.error("Error saving defects:", error);
    res.status(500).json({ message: "Failed to save defects." });
  }
});



app.get("/api/viewDefect/:componentId", async (req, res) => {
  const { componentId } = req.params;

  try {
    // Fetch only submitted defects for the given component_id
    const defectQuery = "SELECT * FROM defects WHERE component_id = $1";
    const defectResult = await pool.query(defectQuery, [componentId]);

    res.status(200).json({
      defects: defectResult.rows,
    });
  } catch (error) {
    console.error("Error fetching defects:", error);
    res.status(500).json({ message: "Failed to retrieve data." });
  }
});

// Endpoint to handle file upload
app.post("/uploads", upload.single("file"), async (req, res) => {
  try {
    const { componentId } = req.body;
    const filePath = req.file ? req.file.path : null;

    if (!componentId || !filePath) {
      return res.status(400).json({ error: "Missing component ID or file" });
    }

    const client = await pool.connect();
    await client.query(
      "INSERT INTO files (component_id, file_path) VALUES ($1, $2)",
      [componentId, filePath]
    );
    client.release();

    res.status(200).json({ message: "File uploaded and saved!", filePath });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
});




app.post('/api/saveDefect', upload.any(), async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Log request body for debugging

    const { componentId, defects } = req.body;

    if (!defects) {
      return res.status(400).json({ error: 'Defects data is missing or invalid.' });
    }

    let parsedDefects;
    try {
      parsedDefects = JSON.parse(defects); // Deserialize defects data
    } catch (error) {
      return res.status(400).json({ error: 'Failed to parse defects data' });
    }

    if (!Array.isArray(parsedDefects)) {
      return res.status(400).json({ error: 'Defects data is not an array' });
    }

    console.log("Parsed Defects:", parsedDefects);

    const client = await pool.connect();

    for (let defect of parsedDefects) {
      if (!defect.defectId) {
        return res.status(400).json({ error: 'Each defect entry must have a defectId' });
      }

      await client.query(
        `INSERT INTO defectz (defect_id, component_id, defect_name, elimination_method, work_date, performer_name, signature_path, file_path) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          defect.defectId, // Ensure defectId is passed and stored
          componentId,
          defect.defectName,
          defect.eliminationMethod,
          defect.workDate,
          defect.performerName,
          req.files.find(file => file.fieldname === `performerSignature${defect.defectId}`)?.path || null,
          req.files.find(file => file.fieldname === 'file')?.path || null,
        ]
      );
    }

    res.status(200).json({ message: 'Defects, signatures, and documents saved successfully!' });
  } catch (error) {
    console.error('Error saving defect data:', error);
    res.status(500).json({ error: 'Failed to save defect data' });
  }
});




app.listen(5000, () => console.log("Server running on port 5000"));