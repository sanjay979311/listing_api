// import express from 'express';
// import { createCourse, updateCourse, deleteCourse, getAllCourses, getCourseById } from '../controllers/courseController.js';
// import upload from '../utiles/multer.js';
// import { authMiddleware } from '../middlewares/authMiddleware.js';
// import { roleMiddleware } from '../middlewares/roleMiddleware.js';

// const router = express.Router();

// // Get all courses
// router.get('/list', getAllCourses);

// // Get single course by ID
// router.get('/:id', getCourseById);

// // Create course (Admin only)
// router.post('/create', authMiddleware, roleMiddleware(['admin']), upload.single('thumbnail'), createCourse);

// // Update course (Admin only)
// router.put('/update/:id', authMiddleware, roleMiddleware(['admin']), upload.single('thumbnail'), updateCourse);

// // Delete course (Admin only)
// router.delete('/remove/:id', authMiddleware, roleMiddleware(['admin']), deleteCourse);

// export default router;

import express from 'express';
import { createCourse, updateCourse, deleteCourse, courseList, getCourseById } from '../controllers/courseController.js';
import upload from '../utiles/multer.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/course/list', courseList);
router.get('/course/:id', authMiddleware, roleMiddleware(['admin']), getCourseById);
router.post('/course/create', authMiddleware, roleMiddleware(['admin']), upload.single('thumbnail'), createCourse);
router.put('/course/update/:id', authMiddleware, roleMiddleware(['admin']), upload.single('thumbnail'), updateCourse);
router.delete('/course/remove/:id', authMiddleware, roleMiddleware(['admin']), deleteCourse);

export default router;
