import express from 'express';
import { register, login, logout, changePassword, updateStudentPassword, deleteStudent, updateStudent } from '../controllers/authControllers.js'
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// GET /api/
router.get("/", (req, res) => {
    res.json({
        message: "This is the category route."
    });
});

// POST /api/create
router.post("/register", register);

router.post("/login", login);
// router.post("/change-password", authMiddleware, roleMiddleware(['admin']), changePassword);
router.post("/change-password", authMiddleware, changePassword);
router.post("/update-customer-password", authMiddleware, roleMiddleware(['admin']), updateStudentPassword);
router.get("/logout", logout);
// router.get("/dockter-list", authMiddleware, getDockterList);
// router.get("/doctors/specialization", getDoctorsBySpecialization);
// router.get("/doctors/filter", getDoctorsByMultipleFilters);
router.put('/employee/update/:id', authMiddleware, roleMiddleware(['admin']), updateStudent);
router.delete('/remove-employee/:id', authMiddleware, roleMiddleware(['admin']), deleteStudent);


export default router;
