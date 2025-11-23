// City Schema (Related to State)
import mongoose from 'mongoose';

const citySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'State',
        required: true,
    },
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const City = mongoose.model('City', citySchema);
export default City;
