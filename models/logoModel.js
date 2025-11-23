import { Schema, model } from 'mongoose'; // Use import for mongoose

const logoSchema = new Schema({

    name: {
        type: String,
        unique: true,
        required: true
    },

    image: {
        type: String,
    },


}, { timestamps: true });

export default model('Logo', logoSchema);  // Use export default
