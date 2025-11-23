import Course from '../models/courseModel.js';
import slugify from 'slugify';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// List all courses
export const courseList = async (req, res) => {
  try {
    const courses = await Course.find({}).sort({ createdAt: -1 });
    res.status(200).json(courses);
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

// Get course by ID
export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.status(200).json(course);
  } catch (err) {
    console.error('Error fetching course:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


export const createCourse = async (req, res) => {
  try {
    const {
      title,
      sortDesc,
      description,
      price,
      category,
      subCategory,
      active,
      videoUrl,
      sections
    } = req.body;

    // Parse nested fields
    const faqs = req.body.faqs ? JSON.parse(req.body.faqs) : [];
    const seo = req.body.seo ? JSON.parse(req.body.seo) : {};

    // Convert section IDs to ObjectId array (use 'new')
    // const parsedSections = sections
    //   ? JSON.parse(sections).map(id => new mongoose.Types.ObjectId(id))
    //   : [];

    // Handle image
    let courseImg = "";
    if (req.file) {
      courseImg = `/uploads/${req.file.filename}`;
    } else if (req.body.courseImg) {
      courseImg = req.body.courseImg;
    }

    // Create new course
    const newCourse = new Course({
      title,
      sortDesc,
      description,
      price,
      category,
      subCategory,
      active,
      courseImg,
      videoUrl,
      faqs,
      seo,
      // sections: parsedSections
    });

    await newCourse.save();

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course: newCourse,
    });

  } catch (error) {
    console.error("Error creating course:", error);
    res.status(400).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};



// Create new course
// export const createCourse = async (req, res) => {
//   try {
//     const { title, description, modules, price, active, category, instructor, subtitle, learning, testimonials, quizSet } = req.body;
//     const thumbnail = req.file?.filename;

//     retu
//     if (!title || !thumbnail) {
//       return res.status(400).json({ error: 'Title and thumbnail are required' });
//     }

//     const newCourse = await Course.create({
//       title,
//       slug: slugify(title, { lower: true }),
//       description,
//       thumbnail,
//       modules: modules ? JSON.parse(modules) : [],
//       price: price ? Number(price) : 0,
//       active: active !== undefined ? active : true,
//       category,
//       instructor,
//       subtitle,
//       learning: learning ? JSON.parse(learning) : [],
//       testimonials: testimonials ? JSON.parse(testimonials) : [],
//       quizSet,
//     });

//     res.status(201).json({ message: 'Course created successfully', course: newCourse });
//   } catch (err) {
//     console.error('Error creating course:', err);
//     res.status(500).json({ error: 'Failed to create course' });
//   }
// };

// Update course
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, modules, price, active, category, instructor, subtitle, learning, testimonials, quizSet } = req.body;
    const newThumbnail = req.file?.filename;

    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    // Delete old thumbnail if new uploaded
    if (newThumbnail && course.thumbnail) {
      const oldThumbnailPath = path.join(__dirname, '..', 'uploads', course.thumbnail);
      if (fs.existsSync(oldThumbnailPath)) fs.unlinkSync(oldThumbnailPath);
    }

    // Update fields
    if (title) {
      course.title = title;
      course.slug = slugify(title, { lower: true });
    }
    if (description) course.description = description;
    if (modules) course.modules = JSON.parse(modules);
    if (price) course.price = Number(price);
    if (active !== undefined) course.active = active;
    if (category) course.category = category;
    if (instructor) course.instructor = instructor;
    if (subtitle) course.subtitle = subtitle;
    if (learning) course.learning = JSON.parse(learning);
    if (testimonials) course.testimonials = JSON.parse(testimonials);
    if (quizSet) course.quizSet = quizSet;
    if (newThumbnail) course.thumbnail = newThumbnail;

    const updatedCourse = await course.save();
    res.status(200).json({ message: 'Course updated successfully', course: updatedCourse });
  } catch (err) {
    console.error('Error updating course:', err);
    res.status(500).json({ error: 'Failed to update course' });
  }
};

// Delete course
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    // Delete thumbnail
    if (course.thumbnail) {
      const thumbnailPath = path.join(__dirname, '..', 'uploads', course.thumbnail);
      if (fs.existsSync(thumbnailPath)) fs.unlinkSync(thumbnailPath);
    }

    await Course.findByIdAndDelete(id);
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (err) {
    console.error('Error deleting course:', err);
    res.status(500).json({ error: 'Failed to delete course' });
  }
};
