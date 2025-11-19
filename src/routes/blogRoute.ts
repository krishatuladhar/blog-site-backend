import express from "express";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogBySlug,
  updateBlog,
} from "../controllers/blogController";
import { upload } from "../middlewares/upload";

import { protect } from "../middlewares/protect";

const blogRoutes = express.Router();
blogRoutes.get("/", getAllBlogs);
blogRoutes.get("/:slug", getBlogBySlug);

blogRoutes.post("/", protect, upload.single("image"), createBlog);
blogRoutes.put("/:slug", upload.single("image"), updateBlog);
blogRoutes.delete("/:slug", deleteBlog);

export default blogRoutes;
