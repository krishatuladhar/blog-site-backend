import express from "express";
import {
  createBlogController,
  deleteBlogController,
  getAllBlogsController,
  getBlogBySlugController,
  getMyBlogsController,
  updateBlogController,
} from "../controllers/blogController";
import { upload } from "../middlewares/upload";

import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";

const blogRoutes = express.Router();
blogRoutes.get(
  "/my-blogs",
  authenticate,
  authorize("author"),
  getMyBlogsController
);
blogRoutes.get("/", getAllBlogsController);
blogRoutes.get("/:slug", getBlogBySlugController);

blogRoutes.post(
  "/",
  authenticate,
  authorize("author"),
  upload.single("image"),
  createBlogController
);
blogRoutes.put(
  "/:slug",
  authenticate,
  authorize("author"),
  upload.single("image"),
  updateBlogController
);
blogRoutes.delete(
  "/:slug",
  authenticate,
  authorize("author"),
  deleteBlogController
);

export default blogRoutes;
