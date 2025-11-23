


import express from 'express';
import { getProfile, updateDoctorProfile, getDoctorList, getUserList, registerNewDoctor } from '../controllers/user.js'
import upload from '../utiles/multer.js';
const router = express.Router();

// router.get("/register", registerUser); //REGISTER 
//REGISTER 

// Route for getting doctor profile by ID
router.get("/test-profile", (req, res) => {
    res.json({
        message: "This is the registration route. Please use POST to register a new user."
    });
});
router.post('/register-new-doctor/', upload.single('profile_picture'), registerNewDoctor);
router.put('/update-doctor-profile/:id', upload.single('profile_picture'), updateDoctorProfile);
router.get('/get-profile/:id', getProfile);
router.get('/doctor/list/', getDoctorList);
router.get('/user/list/', getUserList);


export default router;