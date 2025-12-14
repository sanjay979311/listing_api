



import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please enter a valid email address']
    },
    mobileNo: {
        type: String,
        required: true,
        match: [/^\d{10}$/, 'Please enter a valid 10-digit mobile number']
    },
    otp: { type: String },
    otpExpires: { type: Date },

    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        default: null // Optional, can be null or required
    },

    isActive: {
        type: Boolean,
        default: true, // or false if activation by admin/email verification is required
    },
    dob: {
        type: Date
    },


    address: {
        type: String,
        default: ''
    },
    locality: {
        type: String,
        default: ''
    },

    city: {
        type: Schema.Types.ObjectId,
        ref: 'City',
        required: false,
    },
    state: {
        type: Schema.Types.ObjectId,
        ref: 'State',
        required: false,
    },
    country: {
        type: Schema.Types.ObjectId,
        ref: 'Country',
        required: false
    },
    pincode: {
        type: String,
        default: ''
    },

    extra_phone_numbers: {
        type: String,
        default: ''
    },
    profile_picture: {
        type: String,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },


}, { timestamps: true });

export default model('User', userSchema);
