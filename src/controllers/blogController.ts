import { Request, Response } from "express";
import { CreateBlogInput, UpdateBlogInput } from "../types/blog";
import * as blogService from "../services/blogService";

export const createBlog = async (req: Request, res: Response) => {
  try {
    const data: CreateBlogInput = req.body;
    if (!data.author_id || !data.title || !data.description) {
      console.log("Author id , title and description are required");
    }
    const blog = await blogService.createBlog(data);
    res
      .status(201)
      .json({ success: true, message: "Blog Created successfully", blog });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await blogService.getAllBlogs();
    res.json({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};
export const getBlogById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const blog = await blogService.getBlogById(id);
    res.json({ success: true, blog });
    if (!blog) {
      res.status(404).json({ success: false, message: "Blog not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const updateBlog = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const data: UpdateBlogInput = req.body;
    const blog = await blogService.updateBlog(id, data);
    if (!blog)
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    res.json({ success: true, blog });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const deleted = await blogService.deleteBlog(id);
    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    res.json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};
