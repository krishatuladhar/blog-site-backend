import { Request, Response } from "express";
import {
  FilterQuery,
  CreateBlogInput,
  UpdateBlogInput,
} from "../types/blogTypes";
import * as blogService from "../services/blogService";
import {
  createBlogSchema,
  updateBlogSchema,
} from "../validators/blogValidators";

export const createBlog = async (req: Request, res: Response) => {
  try {
    const data: CreateBlogInput = req.body;
    const { error } = createBlogSchema.validate(data);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });

    if (req.file) {
      data.image = req.file.filename;
      console.log(data.image);
    }

    const blog = await blogService.createBlog(data);
    res
      .status(201)
      .json({ success: true, message: "Blog Created successfully", blog });
  } catch (error: unknown) {
    const err = error as Error;
    res
      .status(500)
      .json({ success: false, message: err.message || "Server error", error });
  }
};

export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = (req.query.search as string) || undefined;
    const sort = (req.query.sort as string) || undefined;

    const paginationData: FilterQuery = { page, limit, search, sort };

    const blogs = await blogService.getAllBlogs(paginationData);
    res.json({ success: true, ...blogs });
  } catch (error: unknown) {
    const err = error as Error;
    res
      .status(500)
      .json({ success: false, message: err.message || "Server error", error });
  }
};
export const getBlogBySlug = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug;
    const blog = await blogService.fetchBlogBySlug(slug);

    if (!blog) {
      res.status(404).json({ success: false, message: "Blog not found" });
    }
    res.json({ success: true, blog });
  } catch (error: unknown) {
    const err = error as Error;
    res
      .status(500)
      .json({ success: false, message: err.message || "Server error", error });
  }
};

export const updateBlog = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug;
    const data: UpdateBlogInput = req.body;
    const { error } = updateBlogSchema.validate(data);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });

    if (req.file) {
      data.image = req.file.filename;
    }
    const blog = await blogService.updateBlog(slug, data);
    if (!blog)
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    res.json({ success: true, blog });
  } catch (error: unknown) {
    const err = error as Error;
    res
      .status(500)
      .json({ success: false, message: err.message || "Server error", error });
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug;
    const deleted = await blogService.deleteBlog(slug);
    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    res.json({ success: true, message: "Blog deleted successfully" });
  } catch (error: unknown) {
    const err = error as Error;
    res
      .status(500)
      .json({ success: false, message: err.message || "Server error", error });
  }
};
