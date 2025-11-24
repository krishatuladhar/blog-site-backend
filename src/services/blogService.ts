import pool from "../config/db";
import {
  Blog,
  CreateBlogInput,
  UpdateBlogInput,
  ApiResponse,
  FilterQuery,
} from "../types/blogTypes";
import { paginate } from "../utils/pagination";
import { slugify } from "../utils/slugify";
import { v4 as uuidv4 } from "uuid";

export const createBlog = async (data: CreateBlogInput): Promise<Blog> => {
  const { author_id, title, description, image } = data;
  const authorCheck = await pool.query(
    `SELECT id FROM authors WHERE id=$1 AND deleted_at IS NULL`,
    [author_id]
  );
  if (authorCheck.rowCount === 0) {
    throw new Error(`Unable to create blog`);
  }
  const titleCheck = await pool.query(
    `SELECT id FROM blogs WHERE author_id=$1 AND title=$2 AND deleted_at IS NULL`,
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
  data: FilterQuery
): Promise<ApiResponse<Blog>> => {
  const { page, limit, offset } = paginate({
    page: data.page,
    limit: data.limit,
  });
  const params: (string | number)[] = [];
  let query = `
    SELECT b.id, b.title, b.description, b.image, a.id AS author_id, a.name AS author_name
    FROM blogs b
    JOIN authors a ON a.id = b.author_id WHERE b.deleted_at IS NULL
  `;

  // Optional search
  if (data.search) {
    params.push(`%${data.search}%`);
    query += ` AND b.title ILIKE $${params.length}`;
  }

  // Optional sort
  query +=
    data.sort === "asc"
      ? " ORDER BY b.created_at ASC"
      : " ORDER BY b.created_at DESC";

  // Pagination
  params.push(limit || 10, offset);
  query += ` LIMIT $${params.length - 1} OFFSET $${params.length}`;

  const result = await pool.query(query, params);

  // Default: Count all blogs
  let totalQuery = `SELECT COUNT(*) FROM blogs WHERE deleted_at IS NULL`;
  const totalParams: any[] = [];

  // If there's a search term
  if (data.search) {
    totalQuery += ` AND title ILIKE $1`;
    totalParams.push(`%${data.search}%`);
  }

  const totalResult = await pool.query(totalQuery, totalParams);
  const total = Number(totalResult.rows[0].count);
  const totalPage = Math.ceil(total / limit);
  return {
    data: result.rows,
    pagination: {
      total,
      page,
      limit,
      totalPage,
    },
  };
};
export const fetchBlogBySlug = async (slug: string): Promise<Blog | null> => {
  const result = await pool.query(
    `SELECT b.*, a.name AS author_name, a.profile AS author_profile
     FROM blogs b
     JOIN authors a ON a.id = b.author_id
     WHERE b.slug = $1 AND b.deleted_at IS NULL`,
    [slug]
  );
  return result.rows[0] || null;
};

export const updateBlog = async (
  slug: string,
  data: UpdateBlogInput
): Promise<Blog | null> => {
  const { title, description, image } = data;
  const blogCheck = await pool.query(
    `SELECT * FROM blogs WHERE slug=$1 AND deleted_at IS NULL`,
    [slug]
  );
  if (blogCheck.rowCount === 0) {
    throw new Error(`Unable to update blog`);
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
     WHERE slug = $5 AND deleted_at IS NULL
     RETURNING *`,
    [title, description, image, newSlug, slug]
  );

  return result.rows[0] || null;
};

export const deleteBlog = async (slug: string): Promise<boolean> => {
  const blogCheck = await pool.query(
    `SELECT id FROM blogs WHERE slug=$1 AND deleted_at IS NULL`,
    [slug]
  );
  if (blogCheck.rowCount === 0) {
    throw new Error(`Unable to delete blog`);
  }
  const result = await pool.query(
    `UPDATE blogs SET deleted_at = NOW() WHERE slug = $1 AND deleted_at IS NULL`,
    [slug]
  );
  return (result.rowCount ?? 0) > 0;
};
