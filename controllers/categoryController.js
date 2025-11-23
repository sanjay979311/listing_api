


import Category from '../models/categoryModel.js'
import slugify from 'slugify';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const categoryList = async (req, res) => {

    let list = await Category.find({}).sort({ createdAt: -1 });
    return res.status(200).json(list);
}


export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json(category);

    } catch (error) {
        console.error("Error fetching Category:", error);
        res.status(500).json({ message: "Server error" });
    }
};



export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const image = req.file?.filename;

        // Validate input
        if (!name || !image) {
            return res.status(400).json({ error: 'Name and image are required' });
        }

        // Generate slug
        const slug = slugify(name, { lower: true });

        // Check if category already exists
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ error: 'Category already exists' });
        }

        // Create new category
        const newCategory = await Category.create({
            name,
            image,
            slug,
        });

        res.status(201).json({
            message: 'Category created successfully',
            category: newCategory,
        });

    } catch (err) {
        console.error('Error creating category:', err);
        res.status(500).json({ error: 'Failed to create category' });
    }
};


export const updateCategory = async (req, res) => {
    try {
        // console.log("body is =======>", req.body);
        const { id } = req.params; // Get the category ID from the URL
        const { name } = req.body;

        // Get the new uploaded image filename (if any)
        let image = req.file?.filename;

        // console.log("image is ========>", image);
        // console.log("name is ========>", name);

        // Validate input
        if (!name && !image) {
            return res.status(400).json({ error: 'Name or image is required for update' });
        }

        // Find the category by ID
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // If a new image is uploaded, delete the old image (if it exists)
        if (req.file && category.image) {
            try {
                // Construct the full path to the old image
                const oldImagePath = path.join(__dirname, '..', 'uploads', category.image);

                // Check if the old image file exists before attempting to delete it
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath); // Delete the old image file
                    console.log('Old image file deleted:', oldImagePath);
                } else {
                    console.warn('Old image file does not exist:', oldImagePath);
                }
            } catch (err) {
                console.error('Error deleting old image file:', err);
                // Continue even if the old image deletion fails
            }
        }

        // Update category fields
        if (name) {
            category.name = name;
            category.slug = slugify(name, { lower: true }); // Update slug
        }
        if (image) {
            category.image = image; // Update image path only if a new image is uploaded
        }

        // Save the updated category
        const updatedCategory = await category.save();

        res.status(200).json({
            message: 'Category updated successfully',
            category: updatedCategory,
        });

    } catch (err) {
        console.error('Error updating category:', err);
        res.status(500).json({ error: 'Failed to update category' });
    }
};

// Delete a category
export const deleteCategory = async (req, res) => {

    try {
        const { id } = req.params; // Get the category ID from the URL


        // Find the category by ID
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        const imagePath = path.join('uploads', category.image);
        // Delete the associated image file
        // if (category.image) {
        //     fs.unlinkSync(category.image); // Delete the image file
        // }

        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath); // Delete the image file
        }

        // Delete the category from the database
        await Category.findByIdAndDelete(id);

        res.status(200).json({
            message: 'Category deleted successfully',
        });

    } catch (err) {
        console.error('Error deleting category:', err);
        res.status(500).json({ error: 'Failed to delete category' });
    }
};

// export const deleteCategory = async (req, res) => {
//     console.log("Category id is ======>", req.params)
//     try {
//         const { id } = req.params; // Get the category ID from the URL

//         // Find the category by ID
//         const category = await Category.findById(id);
//         if (!category) {
//             return res.status(404).json({ error: 'Category not found' });
//         }

//         // Define the full image path
//         const imagePath = path.join('uploads', category.image);

//         // Check if the file exists before deleting
//         if (fs.existsSync(imagePath)) {
//             fs.unlinkSync(imagePath); // Delete the image file
//         }

//         // Delete the category from the database
//         await Category.findByIdAndDelete(id);

//         res.status(200).json({
//             message: 'Category deleted successfully',
//         });

//     } catch (err) {
//         console.error('Error deleting category:', err);
//         res.status(500).json({ error: 'Failed to delete category' });
//     }
// };