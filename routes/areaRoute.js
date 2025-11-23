

import express from 'express';
import {
    createArea,
    getAllArea,
    getCitiesByCountry,
    getCitiesByState,
    getSingleArea,
    updateArea,
    deleteArea,
    getAreaByStateId
} from '../controllers/areaController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// ✅ Only Admin can create a Area
router.post('/create', authMiddleware, roleMiddleware(['admin']), createArea);

// ✅ Admin & Customers can view all cities
router.get('/', getAllArea);

// ✅ Admin & Customers can get cities by state ID
router.get('/get-area-by-country/:id', getCitiesByCountry);
router.get('/state/:stateId', getCitiesByState);

router.get('/get-area-by-state/:id', getAreaByStateId);


// ✅ Admin & Customers can get a single Area by ID
router.get('/:id', getSingleArea);

// ✅ Only Admin can update a Area
router.put('/:id', authMiddleware, roleMiddleware(['admin']), updateArea);

// ✅ Only Admin can delete a Area
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteArea);

export default router;

