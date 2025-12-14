import express from "express";
import {
  createPost,
  updatePost,
  deletePost,
  postList,
  getPostById,
} from "../controllers/postController.js";

import upload from "../utiles/multer.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = express.Router();

/* ------------------------------------
        SINGLE POST CRUD
------------------------------------- */

// ➤ List All Posts
router.get(
  "/post/list",
  authMiddleware,
  roleMiddleware(["admin"]),
  postList
);

// ➤ Get One Post
router.get(
  "/post/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  getPostById
);

// ➤ Create (MULTIPLE IMAGES)
router.post(
  "/post/create",
  authMiddleware,
  roleMiddleware(["admin"]),
  upload.array("images", 10),
  createPost
);

// ➤ Update (MULTIPLE IMAGES)
router.put(
  "/post/update/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  upload.array("images", 10),
  updatePost
);

// ➤ Delete Post
router.delete(
  "/post/remove/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  deletePost
);

export default router;
