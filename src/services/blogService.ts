import pool from "../config/db";
import {
  Blog,
  CreateBlogInput,
  PaginatedBlogs,
  UpdateBlogInput,
} from "../types/blogTypes";
import { slugify } from "../utils/slugify";
import { v4 as uuidv4 } from "uuid";

export const createBlog = async (data: CreateBlogInput): Promise<Blog> => {
  const { author_id, title, description, image } = data;
  const authorCheck = await pool.query(`SELECT id FROM authors WHERE id=$1`, [
    author_id,
  ]);
  if (authorCheck.rowCount === 0) {
    throw new Error(`Author with id ${author_id} does not exist`);
  }
  const titleCheck = await pool.query(
    `SELECT id FROM blogs WHERE author_id=$1 AND title=$2`,
    [author_id, title]
  );
  if ((titleCheck.rowCount ?? 0) > 0) {
    throw new Error(`Blog with this title already exists for this author`);
  }
  const slug = `${slugify(title)}-${uuidv4().substring(0, 8)}`;

  const insertResult = await pool.query(
    `INSERT INTO blogs(title, description, author_id, image, slug)
     VALUES($1, $2, $3, $4, $5)
     RETURNING *`,
    [title, description, author_id, image ?? null, slug]
  );

  return insertResult.rows[0];
};

export const getAllBlogs = async (
  limit: number,
  offset: number
): Promise<PaginatedBlogs> => {
  const totalResult = await pool.query(`SELECT COUNT(*) FROM blogs`);
  const total = Number(totalResult.rows[0].count);
  const result = await pool.query(
    `SELECT b.id, b.title, b.description, b.image, a.id AS author_id, a.name AS author_name                                              
   FROM blogs b
   JOIN authors a ON a.id = b.author_id
   ORDER BY b.created_at DESC
   LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return {
    blogs: result.rows,
    total,
    page: Math.floor(offset / limit) + 1,
    limit,
    offset,
  };
};
export const fetchBlogBySlug = async (slug: string): Promise<Blog | null> => {
  const result = await pool.query(
    `SELECT b.*, a.name AS author_name, a.profile AS author_profile
     FROM blogs b
     JOIN authors a ON a.id = b.author_id
     WHERE b.slug = $1`,
    [slug]
  );
  return result.rows[0] || null;
};

export const updateBlog = async (
  slug: string,
  data: UpdateBlogInput
): Promise<Blog | null> => {
  const { title, description, image } = data;
  const blogCheck = await pool.query(`SELECT * FROM blogs WHERE slug=$1`, [
    slug,
  ]);
  if (blogCheck.rowCount === 0) {
    throw new Error(`Blog with slug "${slug}" does not exist`);
  }
  let newSlug: string | null = null;
  if (title) {
    newSlug = `${slugify(title)}-${uuidv4().substring(0, 8)}`;
  }
  const result = await pool.query(
    `UPDATE blogs
     SET
       title = COALESCE($1, title),
       description = COALESCE($2, description),
       image = COALESCE($3, image),
       slug = COALESCE($4, slug)
     WHERE slug = $5
     RETURNING *`,
    [title, description, image, newSlug, slug]
  );

  return result.rows[0] || null;
};

export const deleteBlog = async (slug: string): Promise<boolean> => {
  const blogCheck = await pool.query(`SELECT id FROM blogs WHERE slug=$1`, [
    slug,
  ]);
  if (blogCheck.rowCount === 0) {
    throw new Error(`Blog with slug ${slug} does not exist`);
  }
  const result = await pool.query(`DELETE FROM blogs WHERE slug= $1`, [slug]);
  return (result.rowCount ?? 0) > 0;
};
