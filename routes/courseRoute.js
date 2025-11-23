import express from 'express';

import upload from '../utiles/multer.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import { courseList, createCourse, deleteCourse, getCourseById, updateCourse } from '../controllers/courseController.js';
const router = express.Router();


// POST /api/create
router.get("/course/list", courseList);
router.get("/course/:id", authMiddleware, roleMiddleware(['admin']), getCourseById);
router.post("/course/create", authMiddleware, roleMiddleware(['admin']), upload.single('courseImg'), createCourse);
// Update an existing category
// router.put('/category/update/:id', upload.single('image'), updateCategory);
router.put('/course/update/:id', authMiddleware, roleMiddleware(['admin']), upload.single('courseImg'), updateCourse);

// Delete a category
router.delete('/course/remove/:id', authMiddleware, roleMiddleware(['admin']), deleteCourse);

export default router;