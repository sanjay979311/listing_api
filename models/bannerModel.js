import { Schema, model } from 'mongoose'; // Use import for mongoose

const bannerSchema = new Schema({


    title: {
        type: String,
        unique: true,
        required: true
    },

    description: {
        type: String
    },
    image: {
        type: String,
    },


}, { timestamps: true });

export default model('Banner', bannerSchema);  // Use export default
