import express from "express";
import multer from "multer";
import path from "path";
import pg from "pg";
import cors from "cors";
import fs from "fs";

const router = express.Router();

// PostgreSQL connection
const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "m1a2k3a4k5a6",
  port: 5432,
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "signatures/"); // Folder for storing signature images
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}.png`);
  },
});

const upload = multer({ storage: storage });

const getSignatureFile = (filePath) => {
  if (!filePath) return null;

  // Ensure filePath does not include 'signatures/' twice
  const cleanedPath = filePath.replace(/^signatures[\\/]/, ""); 
  const absolutePath = path.join(process.cwd(), "signatures", cleanedPath);

  // console.log("Checking file path from DB:", filePath);
  // console.log("Absolute path to check:", absolutePath);

  if (fs.existsSync(absolutePath)) {
    console.log("File found, returning:", `/signatures/${cleanedPath}`);
    return `/signatures/${cleanedPath}`;
  } else {
    console.log("File NOT found:", absolutePath);
    return null;
  }
};



// Create signatures table if not exists
pool.query(`
  CREATE TABLE IF NOT EXISTS signatures (
    id SERIAL PRIMARY KEY,
    component_id INT NOT NULL,
    performer_signature_path TEXT NOT NULL,
    master_signature_path TEXT NOT NULL,
    qc_signature_path TEXT NOT NULL,
    technical_signature_path TEXT NOT NULL
  );
`);

// API to handle signature uploads
router.post(
  "/api/saveSignatures",
  upload.fields([
    { name: "performerSignature", maxCount: 1 },
    { name: "masterSignature", maxCount: 1 },
    { name: "qcSignature", maxCount: 1 },
    { name: "technicalSignature", maxCount: 1 }, // FIXED: Corrected field name
  ]),
  async (req, res) => {
    try {
      const { componentId, signatureDate } = req.body;

      if (!componentId) {
        return res.status(400).json({ error: "Component ID is required" });
      }

      const performerSignaturePath = req.files["performerSignature"]
        ? `signatures/${req.files["performerSignature"][0].filename}`
        : null;
      const masterSignaturePath = req.files["masterSignature"]
        ? `signatures/${req.files["masterSignature"][0].filename}`
        : null;
      const qcSignaturePath = req.files["qcSignature"]
        ? `signatures/${req.files["qcSignature"][0].filename}`
        : null;
      const technicalSignaturePath = req.files["technicalSignature"]
        ? `signatures/${req.files["technicalSignature"][0].filename}`
        : null;

      // Insert signature paths into the database
      const result = await pool.query(
        `INSERT INTO signatures (component_id, performer_signature_path, master_signature_path, qc_signature_path, technical_signature_path, signature_date)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
         
        [
          componentId,
          performerSignaturePath,
          masterSignaturePath,
          qcSignaturePath,
          technicalSignaturePath,
          signatureDate
        ]
      );

      res.json({ message: "Signatures saved successfully!", data: result.rows[0] });
    } catch (error) {
      console.error("Error saving signatures:", error);
      res.status(500).json({ error: "Failed to save signatures" });
    }
  }
);

const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

router.get("/api/viewSignatures/:componentId", async (req, res) => {
  const { componentId } = req.params;

  console.log("Fetching signatures for componentId:", componentId); // Debugging

  try {
    const query = `
      SELECT performer_signature_path, master_signature_path, qc_signature_path, 
             technical_signature_path, signature_date
      FROM signatures
      WHERE component_id = $1;
    `;

    const result = await pool.query(query, [componentId]);

    console.log("Database query result:", result.rows); // Log what the query returns

    if (result.rows.length === 0) {
      console.log("No signatures found for componentId:", componentId);
      return res.status(404).json({ message: "No signatures found" });
    }

    // Extract signature file paths along with signature_date
    const signatureData = result.rows.map((row) => ({
      performerSignature: getSignatureFile(row.performer_signature_path),
      masterSignature: getSignatureFile(row.master_signature_path),
      qcSignature: getSignatureFile(row.qc_signature_path),
      technicalSignature: getSignatureFile(row.technical_signature_path),
      signatureDate: formatDate (row.signature_date), // Include signature_date in response
    }));

    console.log("Formatted signature data:", signatureData); // Log the final output
    res.json({ signatures: signatureData });
  } catch (error) {
    console.error("Error fetching signatures:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


export default router;
