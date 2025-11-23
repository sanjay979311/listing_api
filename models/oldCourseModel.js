import mongoose from 'mongoose';

const { Schema } = mongoose;

const courseSchema = new Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    description: { type: String, required: true },
    thumbnail: { type: String },
    modules: [{ type: String }], // Array of module IDs or names
    price: { type: Number, required: true },
    active: { type: Boolean, default: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    testimonials: [{ type: String }], // Array of testimonial IDs or strings
    quizSet: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
    learning: [{ type: String }], // Array of learning outcomes
  },
  { timestamps: true }
);

const Course = mongoose.model('Course', courseSchema);

export default Course;
