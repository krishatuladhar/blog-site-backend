import { Request, Response } from "express";
import {
  FilterQuery,
  createBlogInput,
  updateBlogInput,
} from "../types/blogType";
import * as blogService from "../services/blogService";
import {
  createBlogSchema,
  updateBlogSchema,
} from "../validations/blogValidation";


export const createBlogController = async (req: Request, res: Response) => {
  try {
    if (!req.user)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    if (typeof req.body.isFeatured === "string") {
      req.body.isFeatured = req.body.isFeatured === "true";
    }
    const data: createBlogInput = req.body;
    const { error } = createBlogSchema.validate(data);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });

    if (req.file) {
      data.image = req.file.filename;
      console.log(data.image);
    }

    const blog = await blogService.createBlogService(data);
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
export const getMyBlogsController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const filter: FilterQuery = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      search: req.query.search?.toString(),
      sort: req.query.sort as "asc" | "desc" | undefined,
    };

    const blogs = await blogService.getAllBlogsService(
      filter,
      Number(req.user.id)
    );
  
    res.json({ success: true, ...blogs });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllBlogsController = async (req: Request, res: Response) => {
  try {
    const filter: FilterQuery = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      search: req.query.search as string,
      sort: req.query.sort as string,
      isFeatured: req.query.featured === "true",
    };

    const blogs = await blogService.getAllBlogsService(filter);
     console.log("Fetched blogs count:", blogs.data.length);
     console.log(
       "Blog IDs:",
       blogs.data.map((b) => b.id)
     );
    
    const featured = blogs.data.find((b) => b.isFeatured) || null;

    return res.json({
      success: true,
      featured,
      data: blogs.data,
      pagination: blogs.pagination,
    });
  } catch (error: unknown) {
    const err = error as Error;
    res
      .status(500)
      .json({ success: false, message: err.message || "Server error", error });
  }
};
export const getBlogBySlugController = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug;
    const blog = await blogService.fetchBlogBySlugService(slug);

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

export const updateBlogController = async (req: Request, res: Response) => {
  try {
    if (!req.user)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    if (typeof req.body.isFeatured === "string") {
      req.body.isFeatured = req.body.isFeatured === "true";
    }
    const slug = req.params.slug;
    const data: updateBlogInput = req.body;
    const { error } = updateBlogSchema.validate(data);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });

    if (req.file) {
      data.image = req.file.filename;
    }
    const blog = await blogService.updateBlogService(slug, data);
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

export const deleteBlogController = async (req: Request, res: Response) => {
  try {
    if (!req.user)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const slug = req.params.slug;
    const deleted = await blogService.deleteBlogService(slug);
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
