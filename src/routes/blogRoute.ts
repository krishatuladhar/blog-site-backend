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

const blogRoutes = express.Router();
blogRoutes.get("/", getAllBlogs);
blogRoutes.get("/:slug", getBlogBySlug);

blogRoutes.post("/", authenticate, upload.single("image"), createBlog);
blogRoutes.put("/:slug", authenticate, upload.single("image"), updateBlog);
blogRoutes.delete("/:slug", authenticate, deleteBlog);

export default blogRoutes;
