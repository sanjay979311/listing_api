import Country from '../models/countryModel.js';

// ✅ 1. Create a new country (Admin Only)
export const createCountry = async (req, res) => {
    try {
        const { name } = req.body;

        // Check if country already exists
        const existingCountry = await Country.findOne({ name });
        if (existingCountry) {
            return res.status(409).json({ error: 'Country already exists' });
        }

        // Create new country
        const newCountry = await Country.create({ name });

        res.status(201).json({
            message: 'Country created successfully',
            country: newCountry
        });

    } catch (error) {
        console.error('Error creating country:', error);
        res.status(500).json({ error: 'Failed to create country' });
    }
};

// ✅ 2. Get all countries (Accessible by Admin & Customers)
export const getAllCountries = async (req, res) => {
    try {
        const countries = await Country.find().sort({ createdAt: -1 });
        res.status(200).json(countries);
    } catch (error) {
        console.error('Error fetching countries:', error);
        res.status(500).json({ error: 'Failed to fetch countries' });
    }
};

// ✅ 3. Get a single country by ID (Admin Only)
export const getSingleCountry = async (req, res) => {
    try {
        const country = await Country.findById(req.params.id);
        if (!country) {
            return res.status(404).json({ error: 'Country not found' });
        }
        res.status(200).json(country);
    } catch (error) {
        console.error('Error fetching country:', error);
        res.status(500).json({ error: 'Failed to fetch country' });
    }
};

// ✅ 4. Update a country by ID (Admin Only)
export const updateCountry = async (req, res) => {
    try {
        const { name } = req.body;
        const updatedCountry = await Country.findByIdAndUpdate(
            req.params.id,
            { name },
            { new: true }
        );

        if (!updatedCountry) {
            return res.status(404).json({ error: 'Country not found' });
        }

        res.status(200).json({
            message: 'Country updated successfully',
            country: updatedCountry
        });

    } catch (error) {
        console.error('Error updating country:', error);
        res.status(500).json({ error: 'Failed to update country' });
    }
};

// ✅ 5. Delete a country by ID (Admin Only)
export const deleteCountry = async (req, res) => {
    try {
        const deletedCountry = await Country.findByIdAndDelete(req.params.id);
        if (!deletedCountry) {
            return res.status(404).json({ error: 'Country not found' });
        }
        res.status(200).json({ message: 'Country deleted successfully' });
    } catch (error) {
        console.error('Error deleting country:', error);
        res.status(500).json({ error: 'Failed to delete country' });
    }
};
