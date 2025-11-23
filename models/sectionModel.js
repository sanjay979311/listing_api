import { Schema, model } from 'mongoose';

const SectionSchema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  lessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }] // Link Lessons here
}, {
  timestamps: true
});

export default model('Section', SectionSchema);

