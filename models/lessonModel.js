// import mongoose from 'mongoose';

// const lessonSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   section: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Section', // Reference to Section model
//     required: true
//   },
//   videoUrl: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   duration: {
//     type: String, // e.g., "10:30" for 10 minutes 30 seconds
//     required: true,
//     trim: true
//   },
//   summary: {
//     type: String,
//     required: false,
//     trim: true
//   }
// }, {
//   timestamps: true
// });

// const Lesson = mongoose.model('Lesson', lessonSchema);

// module.exports = Lesson;


import { Schema, model } from 'mongoose';

const LessonSchema = new Schema({
  title: { type: String, required: true, trim: true },
  section: { type: Schema.Types.ObjectId, ref: 'Section', required: true },
  videoUrl: { type: String, required: true, trim: true },
  duration: { type: String, required: true, trim: true },
  summary: { type: String, trim: true }
}, {
  timestamps: true
});

export default model('Lesson', LessonSchema);
