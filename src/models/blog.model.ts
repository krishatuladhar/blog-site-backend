import pool from "../config/db";
import { CreateBlogInput, UpdateBlogInput } from "../types/blog";

export type Blog = {
  id: number;
  author_id: number;
  title: string;
  description: string;
  image?: string | null;
  created_at: string;
};

export const createBlog = async (data: CreateBlogInput): Promise<Blog> => {
  const { author_id, title, description, image } = data;

  const result = await pool.query(
    `INSERT INTO blogs(title, description, author_id, image) VALUES($1, $2, $3, $4) RETURNING *`,
    [title, description, author_id, image ?? null]
  );

  return result.rows[0];
};

export const fetchBlog = async (): Promise<Blog[]> => {
  const result = await pool.query(
    "SELECT * FROM blogs ORDER BY created_at DESC"
  );
  return result.rows;
};
export const fetchBlogById = async (id: number): Promise<Blog | null> => {
  const result = await pool.query(`SELECT * FROM blogs WHERE id = $1`, [id]);
  return result.rows[0] || null;
};

export const updateBlog = async (
  id: number,
  data: UpdateBlogInput
): Promise<Blog | null> => {
  const { title, description, image } = data;
  const result = await pool.query(
    ` UPDATE blogs SET title=COALESCE($1,title),
    description=COALESCE($2, description),
    image=COALESCEZ9$3, image WHERE id =$4`,
    [title, description, image, id]
  );
  return result.rows[0] || null;
};

export const deleteBlog = async (id: number): Promise<boolean> => {
  const result = await pool.query(`DELETE FROM blogs WHERE id= $1`, [id]);
  return (result.rowCount ?? 0) > 0;
};
