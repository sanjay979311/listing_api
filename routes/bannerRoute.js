import express from 'express';
import { createBanner, updateBanner, deleteBanner, bannerList, getBannerById } from '../controllers/bannerController.js'; // Add .js extension
import upload from '../utiles/multer.js';
const router = express.Router();


// POST /api/create
router.get("/list", bannerList);
router.get("/single-banner/:id", getBannerById);
router.post("/create", upload.single('image'), createBanner);
// Update an existing category
router.put('/update/:id', upload.single('image'), updateBanner);

// Delete a category
router.delete('/remove/:id', deleteBanner);

export default router;