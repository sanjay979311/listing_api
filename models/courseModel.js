


// import { Schema, model } from 'mongoose';

// const FAQSchema = new Schema({
//   question: { type: String, required: true },
//   answer: { type: String, required: true },
//   isCorrect: { type: Boolean, default: false }
// });

// const CourseSchema = new Schema({
//   title: { type: String, required: true },
//   sortDesc: { type: String, default: null },
//   description: { type: String, required: true },
//   price: { type: Number, required: true, default: 0 },
//   category: { type: Schema.Types.ObjectId, ref: "Category" },
//   subCategory: { type: Schema.Types.ObjectId, ref: "SubCategory" },
//   active: { type: Boolean, required: true, default: false },

//   courseImg: { type: String, default: "" },   // Course image URL
//   videoUrl: { type: String, default: "" },    // Overview video URL

//   faqs: [FAQSchema],                           // Multiple FAQs
//   sections: [{ type: Schema.Types.ObjectId, ref: 'Section' }], // Link Sections
//   seo: {
//     metaTitle: { type: String, default: "" },
//     metaDescription: { type: String, default: "" },
//     metaKeywords: [{ type: String }]
//   },
  
//   createdOn: { type: Date, required: true, default: Date.now },
//   modifiedOn: { type: Date, required: true, default: Date.now },

// });

// export default model("Course", CourseSchema);




import { Schema, model } from 'mongoose';

const FAQSchema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  isCorrect: { type: Boolean, default: false }
});

const CourseSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, default: 0 },
  category: { type: Schema.Types.ObjectId, ref: "Category" },
  subCategory: { type: Schema.Types.ObjectId, ref: "SubCategory" },
  active: { type: Boolean, default: false },
  courseImg: { type: String, default: "" },
  videoUrl: { type: String, default: "" },
  faqs: [FAQSchema],
  seo: {
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    metaKeywords: [{ type: String }]
  },
  sections: [{ type: Schema.Types.ObjectId, ref: 'Section' }] // Link Sections
}, {
  timestamps: true
});

export default model("Course", CourseSchema);

