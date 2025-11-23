const { Schema, model } = require("mongoose");

const adminSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        unique: true,
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    // role: {
    //     type: String,
    //     default : 'admin'
    // },
    role: {
        type: String,
        enum: ['user', 'admin', 'customer'], // roles updated to include 'customer'
        default: 'user', // default role is 'user'
    },
}, { timestamps: true })

module.exports = model('admins', adminSchema)