import express from "express";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogBySlug,
  updateBlog,
} from "../controllers/blogController";
import { upload } from "../middlewares/upload";

const blogRouter = express.Router();
blogRouter.post("/", upload.single("image"), createBlog);
blogRouter.get("/", getAllBlogs);
blogRouter.get("/:slug", getBlogBySlug);
blogRouter.put("/:slug", upload.single("image"), updateBlog);
blogRouter.delete("/:slug", deleteBlog);

export default blogRouter;
