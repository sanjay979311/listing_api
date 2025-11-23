

import mongoose from 'mongoose';

const areaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
    required: true,
  },
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'State',
    required: true,
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ✅ Make combination of name + city unique (not just name)
areaSchema.index({ name: 1, city: 1 }, { unique: true });

// Prevent model overwrite during hot reloads (for Next.js/Nodemon)
const Area = mongoose.models.Area || mongoose.model('Area', areaSchema);

export default Area;

