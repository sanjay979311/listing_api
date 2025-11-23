import express from 'express';
import {
    createCountry,
    getAllCountries,
    getSingleCountry,
    updateCountry,
    deleteCountry
} from '../controllers/countryController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// ✅ Only Admin can create a country
router.post('/', authMiddleware, roleMiddleware(['admin']), createCountry);

// ✅ Admin & Customers can view countries
router.get('/', authMiddleware, getAllCountries);

// ✅ Only Admin can get a single country by ID
router.get('/:id', getSingleCountry);

// ✅ Only Admin can update a country
router.put('/:id', authMiddleware, roleMiddleware(['admin']), updateCountry);

// ✅ Only Admin can delete a country
// router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteCountry);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteCountry);

export default router;
