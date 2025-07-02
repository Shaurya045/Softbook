import multer from "multer";

// Image Storage Engine
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});

const upload = multer({ storage });

export default upload;
