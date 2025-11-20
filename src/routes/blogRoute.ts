import express from "express";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogBySlug,
  updateBlog,
} from "../controllers/blogController";
import { upload } from "../middlewares/upload";

import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";

const blogRoutes = express.Router();
blogRoutes.get("/", getAllBlogs);
blogRoutes.get("/:slug", getBlogBySlug);

blogRoutes.post(
  "/",
  authenticate,
  authorize("author"),
  upload.single("image"),
  createBlog
);
blogRoutes.put(
  "/:slug",
  authenticate,
  authorize("author"),
  upload.single("image"),
  updateBlog
);
blogRoutes.delete("/:slug", authenticate, authorize("author"), deleteBlog);

export default blogRoutes;
