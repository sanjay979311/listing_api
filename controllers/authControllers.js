
import mongoose from 'mongoose';  // Import mongoose
import User from '../models/user.js'
import { createToken } from '../utiles/tokenCreate.js'
import Category from '../models/categoryModel.js';
import City from '../models/cityModel.js'
import bcrypt from 'bcryptjs';
import  axios  from 'axios';

// https://waba.cheapsmsbazaar.com/api/create-message
// {
//     "appkey": "f82c3cf2-8b8b-4e29-bcd3-5061a9c5a8f9",
//     "authkey": "fedMh2VoVGdhC70aHXNBH0yE6Iwd6VhWalp4fF2zlU9DQNmNo5",
//     "to": "8981313005",
//      "template_id": "429467170239842",
//      "language":"en_us",
//     "variables": {
//         "{{1}}": "123456"
       
//     }
// }



export const sendOtp = async (req, res) => {
    try {
        const { mobileNo } = req.body;

        if (!mobileNo) {
            return res.status(400).json({
                success: false,
                message: "Mobile number is required"
            });
        }

        // Find user
        const user = await User.findOne({ mobileNo });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found with this mobile number"
            });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

       

        // Save OTP + expiry in DB
        user.otp = otp;
        user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
        await user.save();

        // WhatsApp API details
        const token = "EAAUZAW89HZBioBO2ueSnNxsHEVQOs2IgEhXvJkZCvHgolXiR7w0zNLL5GePCEcQhyeCkcZCch7KlhCP3ryKX9Y19ts4vOvZAtkI4f0lHVeIlnWGklfWZBTje7ZBehuyGnljZAeEGSYSAYoXxNmRBe5kyQicIdQnvraniedIM3RypBpE9GwfSZAB3ujGrWLP4FsfUfqscIWM8ukrUtx884H33E9LG8FRj7OfqYibW8rKHX64NLxyoQDBmY0sl4G63L";
        const phone_number_id ="337442439463653";

        // Send WhatsApp message
        await axios.post(
            `https://graph.facebook.com/v19.0/${phone_number_id}/messages`,
            {
                messaging_product: "whatsapp",
                to: "91" + mobileNo,  // FORMAT CORRECT
                type: "text",
                text: {
                    body: `Your login OTP is *${otp}*. It is valid for 5 minutes.`
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );
         console.log("WhatsApp message sent successfully to:",  + user.mobileNo);
          console.log("otp =============>",otp)

        return res.status(200).json({
            success: true,
            message: "OTP sent via WhatsApp successfully"
        });

    } catch (error) {
        console.error("Send OTP Error:", error.response?.data || error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to send OTP",
            error: error.message
        });
    }
};


export const loginWithOtp = async (req, res) => {
    try {
        const { mobileNo, otp } = req.body;

        if (!mobileNo || !otp) {
            return res.status(400).json({
                success: false,
                message: "Mobile number and OTP are required"
            });
        }

        // Match user
        const user = await User.findOne({ mobileNo });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check OTP match
        if (user.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        // Check OTP expiry
        if (Date.now() > user.otpExpires) {
            return res.status(400).json({
                success: false,
                message: "OTP expired"
            });
        }

        // Clear OTP after success
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        // If you already use JWT, generate token here
        // Example (modify according to your project)
        const token = user._id.toString();

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user
        });

    } catch (error) {
        console.log("OTP Login Error:", error);
        return res.status(500).json({
            success: false,
            message: "OTP verification failed",
            error: error.message
        });
    }
};


// complete otp base login

export const getDockterList = async (req, res) => {

    // console.log("get api list is")
    try {
        let doctor = await User.find({ role: "doctor", isActive: true }).sort({ createdAt: -1 })
            .populate({
                model: "Category",
                path: "specialization"
            })

        return res.status(200).json({
            success: true,
            message: "Doctor list fetched successfully",
            data: doctor
        });

    } catch (error) {
        console.error("Error fetching doctor:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch doctor list",
            error: error.message
        });
    }
};





export const register = async (req, res) => {
    try {
        const { fullName, email, password, gender, mobileNo } = req.body;
        console.log("register data is =======>", req.body);

        const normalizedEmail = email.trim().toLowerCase();
        const normalizedMobileNo = mobileNo.trim();

        // ✅ 1. Check if the email already exists
        const existingUserByEmail = await User.findOne({ email: normalizedEmail });
        if (existingUserByEmail) {
            return res.status(409).json({ error: 'User email already exists' });
        }

        // ✅ 2. Check if the mobile number already exists
        const existingUserByMobileNo = await User.findOne({ mobileNo: normalizedMobileNo });
        if (existingUserByMobileNo) {
            return res.status(409).json({ error: 'User mobile number already exists' });
        }

        // ✅ 3. Validate if specialization is a valid ObjectId (if it is provided)
        

        // ✅ 4. Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ 5. Create a new user
        const newUser = await User.create({
            fullName,
            email: normalizedEmail,
            password: hashedPassword, // Use the hashed password
            gender: gender || null,

            mobileNo: normalizedMobileNo,
           
          
        });

        // ✅ 6. Respond with success message
        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                mobileNo: newUser.mobileNo,
            },
        });

    } catch (err) {
        console.error('Error during registration:', err); // Log the error for debugging
        res.status(500).json({ error: 'User registration failed' }); // Send a generic error message
    }
};



export const login = async (req, res) => {
    const { email, mobileNo, password } = req.body;

    try {
        if (!email && !mobileNo) {
            return res.status(400).json({ error: 'Email or mobile number is required' });
        }

        // 1. Find user
        const user = await User.findOne({ $or: [{ email }, { mobileNo }] });

        if (!user) {
            return res.status(404).json({ error: 'Invalid login credentials' });
        }

        // 2. Check if password exists in DB
        if (!user.password) {
            console.error('User password is missing from database for:', user.email || user.mobileNo);
            return res.status(500).json({ error: 'Account error. Please contact support.' });
        }

        // 3. Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // 4. Generate token
        const token = createToken({
            id: user.id,
            role: user.role,
            name: user.fullName,
            email: user.email,
        });

        // 5. Set cookie
        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        return res.status(200).json({ token, userId: user._id, name: user.fullName, email: user.email, role: user.role, message: 'Login Success' });
    } catch (err) {
        console.error('Error during login:', err);
        return res.status(500).json({ error: 'Login failed' });
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie('accessToken', null, {
            expires: new Date(Date.now()),
            httpOnly: true
        })
        return res.status(200).json({ message: 'logout Success' })
    } catch (error) {
        // responseReturn(res, 500, { error: error.message })
        res.status(500).json({ error: error.message });
    }
}

export const changePassword = async (req, res) => {
    const { email, old_password, new_password } = req.body;
    // console.log("change password")
    // console.log(email, old_password, new_password)
    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(old_password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Incorrect old password' });

        user.password = await bcrypt.hash(new_password, 10);
        await user.save();
        res.json({ message: 'Password changed successfully' });

    } catch (error) {
        console.log("error is =====>", error)
        res.status(500).json({ message: 'Server Error' });
    }
}

export const updateStudentPassword = async (req, res) => {
    try {
        const { email, new_password } = req.body;
       


        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.password = await bcrypt.hash(new_password, 10);
        await user.save();

        res.json({ message: 'Password updated successfully by admin' });

    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}


export const updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, email, mobileNo, password, address } = req.body;

        // Find the employee by ID
        let employee = await User.findById(id);

        if (!employee) {
            return res.status(404).json({ error: 'Student not found' });
        }
        // console.log("update body is =======>", req.body)

        // Hash password only if provided
        let hashedPassword = employee.password; // Keep old password if no new password is provided
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // Update employee details
        employee.fullName = fullName || employee.fullName;

        employee.email = email || employee.email;
        employee.mobileNo = mobileNo || employee.mobileNo;
        employee.password = hashedPassword;
        employee.address = address || employee.address;

        // Save updated employee
        await employee.save();

        res.status(200).json({ message: 'Student updated successfully', employee });
    } catch (err) {
        console.error('Error updating employee:', err);
        res.status(500).json({ error: 'Student update failed' });
    }
};


export const deleteStudent = async (req, res) => {
    console.log("remove employee", req.params)
    try {
        const { id } = req.params;

        // Find and delete the Student by ID
        const deletedStudent = await User.findByIdAndDelete(id);

        if (!deletedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json({ message: 'Student deleted successfully' });

    } catch (err) {
        console.error('Error deleting Student:', err);
        res.status(500).json({ error: 'Student deletion failed' });
    }
};


