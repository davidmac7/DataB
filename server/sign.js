import express from "express";
import multer from "multer";
import path from "path";
import pg from "pg";
import cors from "cors";

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
      const { componentId } = req.body;

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
        `INSERT INTO signatures (component_id, performer_signature_path, master_signature_path, qc_signature_path, technical_signature_path)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [
          componentId,
          performerSignaturePath,
          masterSignaturePath,
          qcSignaturePath,
          technicalSignaturePath,
        ]
      );

      res.json({ message: "Signatures saved successfully!", data: result.rows[0] });
    } catch (error) {
      console.error("Error saving signatures:", error);
      res.status(500).json({ error: "Failed to save signatures" });
    }
  }
);

export default router;
