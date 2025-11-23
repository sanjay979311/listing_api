import express from 'express';
import { logoList, createLogo, updateLogo, deleteLogo, getLogoById } from '../controllers/logoController.js'; // Add .js extension
import upload from '../utiles/multer.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
const router = express.Router();


// POST /api/create
router.get("/list", logoList);
router.get("/single-logo/:id", authMiddleware, roleMiddleware('admin'), getLogoById);
router.post("/create", authMiddleware, roleMiddleware('admin'), upload.single('image'), createLogo);
// Update an existing category
router.put('/update/:id', authMiddleware, roleMiddleware('admin'), upload.single('image'), updateLogo);

// Delete a category
router.delete('/remove/:id', authMiddleware, roleMiddleware('admin'), deleteLogo);

export default router;
