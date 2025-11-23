import mongoose from 'mongoose';
import User from '../models/user.js';
import bcrypt from 'bcryptjs';

export const getProfile = async (req, res) => {

    // console.log("get user controller")

    try {
        // Find the doctor profile by ID
        const response = await User.findOne({ _id: req.params.id })
            .populate({
                path: "country",
                model: "Country",
                select: "name"
            })
            .populate({
                path: "state",
                model: "State",
                select: "name"
            })
            .populate({
                path: "specialization",
                model: "Category",
                select: "name"
            })
            .populate({
                path: "city",
                model: "City",
                select: "name"
            })

        // If no doctor profile found, return 404 error
        if (!response) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Return the doctor profile if found
        return res.status(200).json(response);
    } catch (error) {
        // Log the error and send an internal server error response
        console.error(error);
        return res.status(500).json({ message: 'An error occurred while fetching doctor profile' });
    }
};

// controllers/doctorController.js


// export const updateDoctorProfile = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const updateData = { ...req.body }; // Clone the body into updateData

//         console.log("params id is ===========>", req.params);
//         console.log("body is ===========>", req.body);
//         console.log("file is ===========>", req.file); // <-- new line to check file info

//         // If a new profile photo is uploaded, add its path to updateData
//         if (req.file) {
//             updateData.profile_picture = req.file.path; // or req.file.filename based on your multer setup
//         }

//         const updatedDoctor = await User.findByIdAndUpdate(
//             id,
//             { $set: updateData },
//             { new: true, runValidators: true }
//         );

//         if (!updatedDoctor) {
//             return res.status(404).json({ success: false, message: 'Doctor not found' });
//         }

//         return res.status(200).json({
//             success: true,
//             message: 'Doctor profile updated successfully',
//             data: updatedDoctor
//         });
//     } catch (error) {
//         console.error("UpdateDoctorProfile Error:", error);
//         return res.status(500).json({
//             success: false,
//             message: 'Something went wrong while updating doctor profile',
//             error: error.message
//         });
//     }
// };


// export const updateDoctorProfile = async (req, res) => {
//     try {
//         const { id } = req.params; // Get the doctor ID from the URL
//         const updateData = { ...req.body }; // Clone the body into updateData

//         console.log("params id is ===========>", req.params); // Log ID for debugging
//         console.log("body is ===========>", req.body); // Log the body for debugging
//         console.log("file is ===========>", req.file); // Log file for debugging (if uploaded)

//         // If a new profile picture is uploaded, add its path to updateData
//         if (req.file) {
//             updateData.profile_picture = req.file?.filename; // Save the file path (you could also use filename depending on your multer setup)
//         }
//         // let image = req.file?.filename;
//         console.log("file is ========>", req.file)
//         console.log("updateData is ========>", updateData)
//         // Find the doctor by ID and update the profile
//         const updatedDoctor = await User.findByIdAndUpdate(
//             id,
//             { $set: updateData },
//             { new: true, runValidators: true } // Return the updated doctor + validate fields
//         );

//         if (!updatedDoctor) {
//             return res.status(404).json({ success: false, message: 'Doctor not found' });
//         }

//         return res.status(200).json({
//             success: true,
//             message: 'Doctor profile updated successfully',
//             data: updatedDoctor // Return the updated doctor details
//         });
//     } catch (error) {
//         console.error("UpdateDoctorProfile Error:", error);
//         return res.status(500).json({
//             success: false,
//             message: 'Something went wrong while updating doctor profile',
//             error: error.message
//         });
//     }
// };


export const registerNewDoctor = async (req, res) => {
    try {
        const {
            fullName,
            email,
            mobileNo,
            password,
            specialization,
            experience,
            mobile,
            gender,
            dob,
            bloodGroup,
            timezone,
            address,
            locality,
            city,
            state,
            country,
            pincode,
            language,
            appointmentFee,
        } = req.body;

        console.log("register doctor  is =========>", req.body)

        // Check if doctor with same email already exists
        const existingDoctor = await User.findOne({ email });
        if (existingDoctor) {
            return res.status(400).json({
                success: false,
                message: 'A doctor with this email already exists.',
            });
        }

        // Hash password (optional if you're not handling auth yet)
        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

        // Prepare doctor data
        const newDoctorData = {
            fullName,
            email,
            mobileNo,
            password: hashedPassword,
            specialization: specialization?.trim(),
            experience: parseInt(experience) || 0,
            mobile,
            gender,
            dob,
            bloodGroup,
            timezone,
            address,
            locality,
            city: city?.trim(),
            state: state?.trim(),
            country: country?.trim(),
            pincode,
            language,
            appointmentFee: parseInt(appointmentFee) || 0,
            profile_picture: req.file?.filename || null,
            role: 'doctor', // Ensure this is set if you differentiate roles
        };

        const newDoctor = new User(newDoctorData);
        await newDoctor.save();

        return res.status(201).json({
            success: true,
            message: 'Doctor registered successfully',
            data: newDoctor,
        });

    } catch (error) {
        console.error('RegisterNewDoctor Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while registering the doctor',
            error: error.message,
        });
    }
};


export const updateDoctorProfile = async (req, res) => {
    try {
        const { id } = req.params;  // Doctor ID from the URL
        // console.log("update profile is =========>", req.body);
        // console.log("file =========>", req.file);

        const doctor = await User.findById(id);
        // console.log("dockter is ===========>", doctor);

        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        const updateData = { ...req.body };

        // Trim the fields that are ObjectId references
        if (updateData.specialization) {
            updateData.specialization = updateData.specialization.trim();
        }
        if (updateData.city) {
            updateData.city = updateData.city.trim();
        }
        if (updateData.country) {
            updateData.country = updateData.country.trim();
        }
        if (updateData.state) {
            updateData.state = updateData.state.trim();
        }

        // Check if email is being updated
        if (updateData.email && updateData.email !== doctor.email) {
            const existingDoctor = await User.findOne({ email: updateData.email });
            if (existingDoctor) {
                return res.status(400).json({
                    success: false,
                    message: 'Email is already taken by another user.'
                });
            }
        }

        // If a new profile picture is uploaded, add its path
        if (req.file) {
            updateData.profile_picture = req.file.filename;
        }

        // Now safely update
        const updatedDoctor = await User.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedDoctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found after update' });
        }

        return res.status(200).json({
            success: true,
            message: 'Doctor profile updated successfully',
        });
    } catch (error) {
        console.error('UpdateDoctorProfile Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while updating the doctor profile',
            error: error.message,
        });
    }
}


export const getDoctorList = async (req, res) => {
    try {
        const doctors = await User.find({ role: "doctor" }).sort({ createdAt: -1 }); // Sort by latest
        return res.status(200).json({
            success: true,
            message: 'Doctor list fetched successfully',
            data: doctors,
        });
    } catch (error) {
        console.error('getDoctorList Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while fetching the doctor list',
            error: error.message,
        });
    }
};


export const getUserList = async (req, res) => {
    try {
        const doctors = await User.find({ role: "patient" }).sort({ createdAt: -1 }); // Sort by latest
        return res.status(200).json({
            success: true,
            message: 'Patient  list fetched successfully',
            data: doctors,
        });
    } catch (error) {
        console.error('getPatient List Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while fetching the patient  list',
            error: error.message,
        });
    }
};



