// import express from "express";
// import pg from "pg";
// import path from "path";
// import fs from "fs";

// const router = express.Router();

// const pool = new pg.Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "postgres",
//   password: "m1a2k3a4k5a6",
//   port: 5432,
// });

// // API to fetch defect details including signature paths
// router.get("/api/viewDefect/:componentId", async (req, res) => {
//   const { componentId } = req.params;

//   try {
//     const defectQuery = `
//       SELECT defect_name, elimination_method, date_work_done, 
//              performer_name, master_name, qc_name, 
//              performer_signature_path, master_signature_path, qc_signature_path, technical_signature_path
//       FROM defects
//       WHERE component_id = $1;
//     `;

//     const result = await pool.query(defectQuery, [componentId]);

//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: "No defect data found" });
//     }

//     // Fetch signatures from the file system based on stored paths
//     const signatures = result.rows.map((row) => {
//       return {
//         performerSignature: getSignatureFile(row.performer_signature_path),
//         masterSignature: getSignatureFile(row.master_signature_path),
//         qcSignature: getSignatureFile(row.qc_signature_path),
//         technicalSignature: getSignatureFile(row.technical_signature_path),
//       };
//     });

//     res.json({ defects: result.rows, signatures });
//   } catch (error) {
//     console.error("Error fetching defect data:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // Function to retrieve the signature file if it exists
// const getSignatureFile = (filePath) => {
//   if (!filePath) return null;

//   const absolutePath = path.join(process.cwd(), "signatures", filePath);

//   if (fs.existsSync(absolutePath)) {
//     return `/signatures/${filePath}`;
//   } else {
//     return null;
//   }
// };

// // Export the router
// export default router;
