

import mongoose from 'mongoose';

const stateSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, unique: true },
    country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: true }, // Foreign Key
    createdAt: { type: Date, default: Date.now },
});

// Prevent model overwrite
const State = mongoose.models.State || mongoose.model('State', stateSchema);

export default State;
