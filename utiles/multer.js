// import multer from 'multer';
// import path from 'path';

// // Set storage engine
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/'); // Save images in the 'uploads' folder
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
//     },
// });

// // Check file type
// const fileFilter = (req, file, cb) => {
//     const filetypes = /jpeg|jpg|png|gif/;
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = filetypes.test(file.mimetype);

//     if (extname && mimetype) {
//         cb(null, true);
//     } else {
//         cb(new Error('Only images are allowed (jpeg, jpg, png, gif)'), false);
//     }
// };

// // Initialize upload
// const upload = multer({
//     storage,
//     fileFilter,
//     limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
// });

// export default upload;

import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";
import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

// AWS S3 Client setup
const s3 = new S3Client({
  region: process.env.AWS_REGION, // us-east-1
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// File filter (same as your old code)
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) cb(null, true);
  else cb(new Error("Only images are allowed (jpeg, jpg, png, gif)"), false);
};

// S3 storage (replaces diskStorage)
const storage = multerS3({
  s3: s3,
  bucket: process.env.AWS_S3_BUCKET,
  // acl: "public-read", // required for public images
  contentType: multerS3.AUTO_CONTENT_TYPE,

  key: (req, file, cb) => {
    const fileName = `categories/${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

// Final multer upload object
const upload = multer({
  storage: storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit (same as your code)
});

export default upload;
