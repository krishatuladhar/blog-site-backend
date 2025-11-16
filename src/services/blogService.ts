import { CreateBlogInput, UpdateBlogInput } from "../types/blog";
import {
  Blog,
  createBlog as createBlogModel,
  fetchBlog as fetchBlogModel,
  fetchBlogById as fetchBlogByIdModel,
  updateBlog as updateBlogModel,
  deleteBlog as deleteBlogModel,
} from "../models/blog.model";

export const createBlog = async (data: CreateBlogInput): Promise<Blog> => {
  return await createBlogModel(data);
};

export const getAllBlogs = async (): Promise<Blog[]> => {
  return await fetchBlogModel();
};

export const getBlogById = async (id: number): Promise<Blog | null> => {
  return await fetchBlogByIdModel(id);
};

export const updateBlog = async (
  id: number,
  data: UpdateBlogInput
): Promise<Blog | null> => {
  return await updateBlogModel(id, data);
};

export const deleteBlog = async (id: number): Promise<boolean> => {
  return await deleteBlogModel(id);
};
