

import express from 'express';
import {
  createOrUpsertWebInfo,
  getWebInfo,
  updateWebInfo,
  deleteWebInfo,
} from '../controllers/webInfoController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Create or upsert web info
router.post('/', authMiddleware, roleMiddleware(['admin']), createOrUpsertWebInfo);

// Get the first or single web info document
router.get('/', authMiddleware, roleMiddleware(['admin']), getWebInfo);

// Update web info (ID via body or query)
router.put('/', authMiddleware, roleMiddleware(['admin']), updateWebInfo);

// Delete web info (ID via query, e.g., /?id=...)
router.delete('/', authMiddleware, roleMiddleware(['admin']), deleteWebInfo);

export default router;

