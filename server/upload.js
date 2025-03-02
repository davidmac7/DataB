import multer from 'multer';
import path from 'path';
import fs from 'fs';



// Create 'scans' directory if it doesn't exist
const scansDir = './scans';
if (!fs.existsSync(scansDir)) {
  fs.mkdirSync(scansDir);
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, scansDir); // Store in 'scans' folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Create a unique filename
  }
});

const uploads = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedTypes = /pdf|jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only PDF, JPG, JPEG, PNG files are allowed"));
    }
  }
});

// Export the upload middleware and the route handler
export { uploads };
