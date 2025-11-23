// State Schema (Related to Country)
import mongoose from 'mongoose';

const stateSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, unique: true, },
    country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: true }, // Foreign Key
    createdAt: { type: Date, default: Date.now },
});

const State = mongoose.model('State', stateSchema);

export default State;
