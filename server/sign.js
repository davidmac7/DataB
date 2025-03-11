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
// pool.query(`
//   CREATE TABLE IF NOT EXISTS signatures (
//     id SERIAL PRIMARY KEY,
//     component_id INT NOT NULL,
//     performer_signature_path TEXT NOT NULL,
//     master_signature_path TEXT NOT NULL,
//     qc_signature_path TEXT NOT NULL,
//     technical_signature_path TEXT NOT NULL
//   );
// `);

// API to handle signature uploads
router.post(
  "/api/saveSignatures",
  upload.fields([
    { name: "performerSignature", maxCount: 1 },
    { name: "masterSignature", maxCount: 1 },
    { name: "qcSignature", maxCount: 1 },
    { name: "technicalSignature", maxCount: 1 },
  ]),
  async (req, res) => {
    const { componentId, signatureDate, defects } = req.body;

    if (!componentId) {
      return res.status(400).json({ error: "Component ID is required" });
    }

    try {
      const parsedDefects = JSON.parse(defects); // Parse defects if sent as JSON string

      if (!Array.isArray(parsedDefects)) {
        return res.status(400).json({ error: "Defects data must be an array" });
      }

      const client = await pool.connect();
      try {
        await client.query("BEGIN"); // Start transaction

        for (let defect of parsedDefects) {
          if (!defect.defectName || !defect.workDate) {
            return res.status(400).json({ error: "Defect name and work date are required" });
          }

          const workDate = defect.workDate.trim() !== "" ? defect.workDate : new Date().toISOString().split('T')[0];

          // Insert defect into `defects` table
          const defectResult = await client.query(
            `INSERT INTO defects (component_id, defect_name, elimination_method, date_work_done, performer_name, master_name, qc_name, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *;`,
            [
              componentId,
              defect.defectName,
              defect.eliminationMethod,
              workDate,
              defect.performerName,
              defect.masterName,
              defect.qcName,
            ]
          );

          const savedDefect = defectResult.rows[0];

          // Insert the same data into `signatures` table along with file paths
          await client.query(
            `INSERT INTO signaturesz (component_id, defect_name, elimination_method, date_work_done, performer_name, master_name, qc_name,  
              performer_signature_path, master_signature_path, qc_signature_path, technical_signature_path)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);`,
            [
              componentId,
              savedDefect.defect_name,
              savedDefect.elimination_method,
              savedDefect.date_work_done,
              savedDefect.performer_name,
              savedDefect.master_name,
              savedDefect.qc_name,
              req.files["performerSignature"] ? `signatures/${req.files["performerSignature"][0].filename}` : null,
              req.files["masterSignature"] ? `signatures/${req.files["masterSignature"][0].filename}` : null,
              req.files["qcSignature"] ? `signatures/${req.files["qcSignature"][0].filename}` : null,
              req.files["technicalSignature"] ? `signatures/${req.files["technicalSignature"][0].filename}` : null,
              
            ]
          );
        }

        await client.query("COMMIT"); // Commit transaction
        res.status(200).json({ message: "Defects and signatures saved successfully!" });
      } catch (error) {
        await client.query("ROLLBACK"); // Rollback on error
        console.error("Error saving defects and signatures:", error);
        res.status(500).json({ error: "Failed to save defects and signatures" });
      } finally {
        client.release();
      }
    } catch (error) {
      console.error("Error parsing defects:", error);
      res.status(400).json({ error: "Invalid defects data" });
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
      SELECT id, component_id, defect_name, elimination_method, date_work_done, 
             performer_name, master_name, qc_name, 
             performer_signature_path, master_signature_path, qc_signature_path, technical_signature_path
      FROM signaturesz
      WHERE component_id = $1;
    `;

    const result = await pool.query(query, [componentId]);

    console.log("Database query result:", result.rows); // Log what the query returns

    if (result.rows.length === 0) {
      console.log("No signatures found for componentId:", componentId);
      return res.status(404).json({ message: "No signatures found" });
    }

    // Map the data correctly, including all necessary fields
    const signatureData = result.rows.map((row) => ({
      id: row.id, // Include the primary key
      defectName: row.defect_name,
      eliminationMethod: row.elimination_method,
      dateWorkDone: row.date_work_done ? new Date(row.date_work_done).toLocaleDateString() : 'N/A',
      performerName: row.performer_name,
      masterName: row.master_name,
      qcName: row.qc_name,
      performerSignature: getSignatureFile(row.performer_signature_path),
      masterSignature: getSignatureFile(row.master_signature_path),
      qcSignature: getSignatureFile(row.qc_signature_path),
      technicalSignature: getSignatureFile(row.technical_signature_path),
    }));

    console.log("Formatted signature data:", signatureData); // Log the final output
    res.json({ signatures: signatureData });
  } catch (error) {
    console.error("Error fetching signatures:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



// DELETE endpoint to remove a defect from the signaturesz table
router.delete("/api/deleteDefect/:defectId", async (req, res) => {
  const { defectId } = req.params;

  try {
    const client = await pool.connect();
    try {
      // Delete the defect record from the signaturesz table
      const deleteQuery = `
        DELETE
        FROM signaturesz WHERE id = $1 RETURNING *;
      `;
      const result = await client.query(deleteQuery, [defectId]);

      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Defect not found" });
      }

      // Send success response
      res.status(200).json({ message: "Defect deleted successfully" });
    } catch (error) {
      console.error("Error deleting defect:", error);
      res.status(500).json({ error: "Failed to delete defect" });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



export default router;
