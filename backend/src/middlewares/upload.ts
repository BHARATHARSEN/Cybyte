import path from 'path';
import multer from 'multer';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Define the directory to store uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Use a timestamp as filename
  }
});

const upload = multer({ storage: storage });

export default upload;