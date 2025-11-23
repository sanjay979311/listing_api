

import Logo from '../models/logoModel.js'
import slugify from 'slugify';
import fs from 'fs';
import path from 'path';


export const logoList = async (req, res) => {

    let list = await Logo.find({}).sort({ createdAt: -1 });;
    return res.status(200).json(list);
}

export const getLogoById = async (req, res) => {
    try {
        const { id } = req.params;

        const logo = await Logo.findById(id);

        if (!logo) {
            return res.status(404).json({ message: "Logo not found" });
        }

        res.status(200).json(logo);
    } catch (error) {
        console.error("Error fetching banner:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const createLogo = async (req, res) => {
    try {
        const { name } = req.body;
        // const image = req.file.path; // Get the uploaded image path

        const image = req.file ? req.file.filename : null;

        // Validate input
        if (!name || !image) {
            return res.status(400).json({ error: 'Name and image are required' });
        }

        // Generate slug


        // Check if logo already exists
        const existingLogo = await Logo.findOne({ name });
        if (existingLogo) {
            return res.status(400).json({ error: 'Logo already exists' });
        }

        // Create new logo
        const newLogo = await Logo.create({
            name,
            image,

        });

        res.status(201).json({
            message: 'Logo created successfully',
            logo: newLogo,
        });

    } catch (err) {
        console.error('Error creating logo:', err);
        res.status(500).json({ error: 'Failed to create logo' });
    }
};




export const updateLogo = async (req, res) => {
    try {
        const { id } = req.params; // Get the logo ID from the URL
        const { name } = req.body;
        const image = req.file?.filename; // Get only the filename

        // Validate input
        if (!name && !image) {
            return res.status(400).json({ error: 'Name or image is required for update' });
        }

        // Find the logo by ID
        const logo = await Logo.findById(id);
        if (!logo) {
            return res.status(404).json({ error: 'Logo not found' });
        }

        // Delete the old image if a new image is uploaded
        if (image && logo.image) {
            const oldImagePath = path.join('uploads', logo.image);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath); // Delete the old image file safely
            }
        }

        // Update logo fields
        if (name) {
            logo.name = name;
        }
        if (image) {
            logo.image = image; // Update image filename
        }

        // Save the updated logo
        const updatedLogo = await logo.save();

        res.status(200).json({
            message: 'Logo updated successfully',
            logo: updatedLogo,
        });

    } catch (err) {
        console.error('Error updating logo:', err);
        res.status(500).json({ error: 'Failed to update logo' });
    }
};
export const deleteLogo = async (req, res) => {
    try {
        const { id } = req.params; // Get the logo ID from the URL

        // Find the logo by ID
        const logo = await Logo.findById(id);
        if (!logo) {
            return res.status(404).json({ error: 'Logo not found' });
        }

        // Define the full image path
        const imagePath = path.join('uploads', logo.image);

        // Check if the file exists before deleting
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath); // Delete the image file
        }

        // Delete the logo from the database
        await Logo.findByIdAndDelete(id);

        res.status(200).json({
            message: 'Logo deleted successfully',
        });

    } catch (err) {
        console.error('Error deleting logo:', err);
        res.status(500).json({ error: 'Failed to delete logo' });
    }
};
