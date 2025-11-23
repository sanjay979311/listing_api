


import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';

const router = express.Router();

// Single API to fetch all dashboard stats at once
router.get("/stats", getDashboardStats);

export default router;