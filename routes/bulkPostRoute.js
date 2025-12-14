import express from "express";
import {
  createBulkPost,
  updateBulkPost,
  deleteBulkPost,
  bulkPostList,
  getBulkPostById,
} from "../controllers/bulkPostController.js";

import upload from "../utiles/multer.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = express.Router();

/* -------------------------------
    BULK POST CRUD ROUTES
-------------------------------- */

// Get All Bulk Posts
router.get(
  "/bulk-post/list",
  authMiddleware,
  roleMiddleware(["admin"]),
  bulkPostList
);

// Get Single Bulk Post
router.get(
  "/bulk-post/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  getBulkPostById
);

// Create Bulk Post (MULTIPLE IMAGES)
router.post(
  "/bulk-post/create",
  authMiddleware,
  roleMiddleware(["admin"]),
  upload.array("images", 10),  // multiple images
  createBulkPost
);

// Update Bulk Post
router.put(
  "/bulk-post/update/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  upload.array("images", 10),
  updateBulkPost
);

// Delete Bulk Post
router.delete(
  "/bulk-post/remove/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  deleteBulkPost
);

export default router;

