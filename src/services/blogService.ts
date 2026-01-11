import pool from "../config/db";
import {
  Blog,
  createBlogInput,
  updateBlogInput,
  ApiResponse,
  FilterQuery,
} from "../types/blogType";
import { paginate } from "../utils/pagination";
import { slugify } from "../utils/slugify";
import { v4 as uuidv4 } from "uuid";

export const createBlogService = async (
  data: createBlogInput
): Promise<Blog> => {
  const { author_id, title, description, category, image, isFeatured } = data;
  const authorCheck = await pool.query(
    `SELECT id FROM users WHERE id=$1 AND deleted_at IS NULL`,
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
  if (isFeatured) {
    await pool.query(
      `UPDATE blogs SET isFeatured = false WHERE isFeatured = true`
    );
  }

  const slug = `${slugify(title)}-${uuidv4().substring(0, 8)}`;

  const insertResult = await pool.query(
    `INSERT INTO blogs(title, description,category, author_id, image, slug,isFeatured)
     VALUES($1, $2, $3, $4, $5, $6 ,$7)
     RETURNING *`,
    [title, description, category, author_id, image ?? null, slug, isFeatured]
  );
  const featuredCheck = await pool.query(
    `SELECT id FROM blogs WHERE isFeatured = true`
  );

  if (featuredCheck.rowCount === 0) {
    const fallback = await pool.query(`
      UPDATE blogs SET isFeatured = true 
      WHERE id = (SELECT id FROM blogs ORDER BY created_at ASC LIMIT 1)
      RETURNING *
    `);
    return fallback.rows[0];
  }

  return insertResult.rows[0];
};

export const getAllBlogsService = async (
  data: FilterQuery,
  authorId?: number
): Promise<ApiResponse<Blog>> => {
  const { page, limit, offset } = paginate({
    page: data.page,
    limit: data.limit,
  });
  const params: (string | number | boolean)[] = [];
  const whereClauses: string[] = ["b.deleted_at IS NULL"];

  // Author filter
  if (authorId) {
    params.push(authorId);
    whereClauses.push(`b.author_id = $${params.length}`);
  }

   if (data.isFeatured === true) {
     params.push(true);
     whereClauses.push(`b.isFeatured = $${params.length}`);
   }

  // Search filter (only on blogs)
  if (data.search) {
    params.push(`%${data.search}%`);
    const idx = params.length;
    whereClauses.push(
      `(b.title ILIKE $${idx} OR b.description ILIKE $${idx} OR b.category ILIKE $${idx})`
    );
  }

  const whereSQL = whereClauses.length
    ? "WHERE " + whereClauses.join(" AND ")
    : "";

  // Sorting purely by created_at DESC
  const query = `
    SELECT 
      b.id, b.title, b.description, b.image, b.category, b.slug, b.isFeatured, b.created_at AS date,
      a.id AS author_id, a.name AS author_name, a.profile AS author_profile
    FROM blogs b
    JOIN users a ON a.id = b.author_id
    ${whereSQL}
    ORDER BY b.created_at DESC
    LIMIT $${params.length + 1} OFFSET $${params.length + 2}
  `;
  params.push(limit, offset);

  const result = await pool.query(query, params);

  // Total count for pagination
  const totalQuery = `SELECT COUNT(*) FROM blogs b ${whereSQL}`;
  const totalResult = await pool.query(
    totalQuery,
    params.slice(0, params.length - 2)
  );
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
export const fetchBlogBySlugService = async (
  slug: string
): Promise<Blog | null> => {
  const result = await pool.query(
    `SELECT b.*, b.created_at AS date, a.name AS author_name, a.profile AS author_profile
     FROM blogs b
     JOIN users a ON a.id = b.author_id
     WHERE b.slug = $1 AND b.deleted_at IS NULL`,
    [slug]
  );
  return result.rows[0] || null;
};

export const updateBlogService = async (
  slug: string,
  data: updateBlogInput
): Promise<Blog | null> => {
  const { title, description, category, image, isFeatured } = data;
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
  if (isFeatured === true) {
    await pool.query(`UPDATE blogs SET isFeatured = false WHERE slug <> $1`, [
      slug,
    ]);
  }

  const result = await pool.query(
    `UPDATE blogs
     SET
       title = COALESCE($1, title),
       description = COALESCE($2, description),
       category = COALESCE($3,category),
       image = COALESCE($4, image),
       slug = COALESCE($5, slug),
       isFeatured = COALESCE($6, isFeatured)
     WHERE slug = $7 AND deleted_at IS NULL
     RETURNING *`,
    [title, description, category, image, newSlug, isFeatured, slug]
  );
  const featuredCheck = await pool.query(
    `SELECT id FROM blogs WHERE isFeatured = true`
  );
  if (featuredCheck.rowCount === 0) {
    await pool.query(`
      UPDATE blogs SET isFeatured = true 
      WHERE id = (SELECT id FROM blogs ORDER BY created_at ASC LIMIT 1)
    `);
  }

  return result.rows[0] || null;
};

export const deleteBlogService = async (slug: string): Promise<boolean> => {
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
