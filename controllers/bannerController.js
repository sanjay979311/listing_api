

import Banner from '../models/bannerModel.js'
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';



// Define __dirname manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const bannerList = async (req, res) => {

    let list = await Banner.find({});
    return res.status(200).json(list);
}

export const getBannerById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("single banner is", id)
        const banner = await Banner.findById(id);

        if (!banner) {
            return res.status(404).json({ message: "Banner not found" });
        }

        res.status(200).json(banner);
    } catch (error) {
        console.error("Error fetching banner:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const createBanner = async (req, res) => {
    try {
        const { title, description } = req.body;
        const imageFileName = req.file?.filename; // Get the uploaded file name

        // Validate input
        if (!title || !imageFileName) {
            return res.status(400).json({ error: 'Title and image are required' });
        }

        // Generate slug


        // Check if banner already exists
        const existingBanner = await Banner.findOne({ title });
        if (existingBanner) {
            return res.status(400).json({ error: 'Banner with this title already exists' });
        }

        // Create new banner
        const newBanner = await Banner.create({
            title,
            description,
            image: imageFileName,

        });

        res.status(201).json({
            message: 'Banner created successfully',
            banner: newBanner,
        });

    } catch (err) {
        console.error('Error creating banner:', err);
        res.status(500).json({ error: 'Failed to create banner' });
    }
};

// Get all banners
export const getAllBanners = async (req, res) => {
    try {
        const banners = await Banner.find();
        res.status(200).json({
            message: 'Banners fetched successfully',
            banners,
        });
    } catch (err) {
        console.error('Error fetching banners:', err);
        res.status(500).json({ error: 'Failed to fetch banners' });
    }
};

// Get a single banner by ID
export const getBanner = async (req, res) => {
    try {
        const { id } = req.params;

        const banner = await Banner.findById(id);
        if (!banner) {
            return res.status(404).json({ error: 'Banner not found' });
        }

        res.status(200).json({
            message: 'Banner fetched successfully',
            banner,
        });
    } catch (err) {
        console.error('Error fetching banner:', err);
        res.status(500).json({ error: 'Failed to fetch banner' });
    }
};

// Update a banner
// export const updateBanner = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { title, description } = req.body;
//         const imageFileName = req.file?.filename; // New uploaded file name

//         console.log("Body data:", req.body);
//         console.log("New imageFileName:", imageFileName);

//         if (!title && !description && !imageFileName) {
//             return res.status(400).json({ error: 'Title, description, or image is required for update' });
//         }

//         // Find the existing banner
//         const banner = await Banner.findById(id);
//         if (!banner) {
//             return res.status(404).json({ error: 'Banner not found' });
//         }

//         // Delete old image only if a new image is uploaded & old image exists
//         if (imageFileName && banner.image) {
//             const oldImagePath = path.join(__dirname, '..', 'uploads', banner.image);
//             if (fs.existsSync(oldImagePath)) {
//                 fs.unlinkSync(oldImagePath);
//                 console.log("Old image deleted:", banner.image);
//             } else {
//                 console.log("Old image not found, skipping deletion:", banner.image);
//             }
//         }

//         // Update banner fields
//         if (title) banner.title = title;
//         if (description) banner.description = description;
//         if (imageFileName) banner.image = imageFileName;

//         const updatedBanner = await banner.save();

//         res.status(200).json({
//             message: 'Banner updated successfully',
//             banner: updatedBanner,
//         });

//     } catch (err) {
//         console.error('Error updating banner:', err);
//         res.status(500).json({ error: 'Failed to update banner' });
//     }
// };


export const updateBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        const imageFileName = req.file?.filename; // New uploaded file name

        console.log("UpdateBanner controller called.");
        console.log("Request body:", req.body);
        console.log("New imageFileName:", imageFileName);

        if (!title && !description && !imageFileName) {
            return res.status(400).json({ error: 'Title, description, or image is required for update' });
        }

        // Find the existing banner
        const banner = await Banner.findById(id);
        if (!banner) {
            console.log("Banner not found with id:", id);
            return res.status(404).json({ error: 'Banner not found' });
        }

        // Delete old image only if a new image is uploaded & old image exists
        if (imageFileName && banner.image) {
            const oldImagePath = path.join(__dirname, '..', 'uploads', banner.image);
            console.log("Attempting to delete old image at:", oldImagePath);
            if (fs.existsSync(oldImagePath)) {
                try {
                    fs.unlinkSync(oldImagePath);
                    console.log("Old image deleted:", banner.image);
                } catch (unlinkError) {
                    console.error("Error deleting old image:", unlinkError);
                    // You can choose to continue the update even if deletion fails.
                }
            } else {
                console.log("Old image not found, skipping deletion:", banner.image);
            }
        }

        // Update banner fields
        if (title) banner.title = title;
        if (description) banner.description = description;
        if (imageFileName) banner.image = imageFileName;

        const updatedBanner = await banner.save();
        console.log("Banner updated successfully:", updatedBanner);

        res.status(200).json({
            message: 'Banner updated successfully',
            banner: updatedBanner,
        });
    } catch (err) {
        console.error('Error updating banner:', err);
        res.status(500).json({ error: 'Failed to update banner' });
    }
};


// // Delete a banner
// export const deleteBanner = async (req, res) => {
//     try {
//         const { id } = req.params; // Get the banner ID from the URL

//         // Find the banner by ID
//         const banner = await Banner.findById(id);
//         if (!banner) {
//             return res.status(404).json({ error: 'Banner not found' });
//         }

//         // Delete the associated image file
//         if (banner.image) {
//             fs.unlinkSync(`uploads/${banner.image}`); // Delete the image file
//         }

//         // Delete the banner from the database
//         await Banner.findByIdAndDelete(id);

//         res.status(200).json({
//             message: 'Banner deleted successfully',
//         });

//     } catch (err) {
//         console.error('Error deleting banner:', err);
//         res.status(500).json({ error: 'Failed to delete banner' });
//     }
// };

export const deleteBanner = async (req, res) => {
    try {
        const { id } = req.params; // Get the banner ID from the URL

        // Find the banner by ID
        const banner = await Banner.findById(id);
        if (!banner) {
            return res.status(404).json({ error: 'Banner not found' });
        }

        // Define the full image path
        const imagePath = path.join('uploads', banner.image);

        // Check if the file exists before deleting
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath); // Delete the image file
        }

        // Delete the banner from the database
        await Banner.findByIdAndDelete(id);

        res.status(200).json({
            message: 'Banner deleted successfully',
        });

    } catch (err) {
        console.error('Error deleting banner:', err);
        res.status(500).json({ error: 'Failed to delete banner' });
    }
};