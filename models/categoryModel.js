import { Schema, model } from 'mongoose'; // Use import for mongoose

const categorySchema = new Schema({
    // name: { type: String, required: true, unique: true },
    // image: { type: String, required: true }, // Store the image URL
    // slug: { type: String, required: true, unique: true },

    name: {
        type: String,
        unique: true,
        required: true
    },
    slug: {
        trim: true,
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String
    },
    image: {
        type: String,
    },


}, { timestamps: true });

export default model('Category', categorySchema);  // Use export default
