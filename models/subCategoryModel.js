

import { Schema, model } from 'mongoose';

const subCategorySchema = new Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true }, // Reference to parent category
     image: {
      type: String,
      default: "", // Cloud URL or relative path
    },
    description: { type: String }, 
}, { timestamps: true }); // Add createdAt and updatedAt fields

export default model('SubCategory', subCategorySchema);