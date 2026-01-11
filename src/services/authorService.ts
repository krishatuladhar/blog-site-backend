import pool from "../config/db";
import {
  Author,
  CreateAuthorInput,
  UpdateAuthorInput,
} from "../types/authorTypes";
import bcrypt from "bcrypt";

export const createAuthor = async (
  data: CreateAuthorInput,
  isRegister = false
): Promise<Author> => {
  const { name, profile, email, password, role } = data;
  const nameCheck = await pool.query(
    `SELECT id FROM authors WHERE name=$1 AND deleted_at IS NULL`,
    [name]
  );
  if ((nameCheck.rowCount ?? 0) > 0) {
    throw new Error(`Author with name "${name}" already exists`);
  }

  if (isRegister && email) {
    const existing = await pool.query(
      `SELECT id FROM authors WHERE email=$1 AND deleted_at IS NULL`,
      [email]
    );
    if ((existing.rowCount ?? 0) > 0) {
      throw new Error(`Email "${email}" already exists`);
    }
  }

  const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
  const result = await pool.query(
    `INSERT INTO authors (name, profile,email,password,role) VALUES($1, $2, $3,$4,$5) RETURNING * `,
    [name, profile ?? null, email, hashedPassword, role ?? "user"]
  );
  const author = { ...result.rows[0] };
  delete author.password;
  return author;
};
export const loginAuthor = async (
  email: string,
  password: string
): Promise<Author | null> => {
  const result = await pool.query(
    `SELECT * FROM authors WHERE email=$1 AND deleted_at IS NULL`,
    [email]
  );
  const user = result.rows[0];
  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return null;

  delete user.password;
  return user;
};

export const getAuthor = async (id: number): Promise<Author> => {
  const result = await pool.query(
    `SELECT * FROM authors WHERE id = $1 AND  deleted_at IS NULL ORDER BY created_at DESC`,
    [id]
  );

  if (result.rowCount === 0) throw new Error("Author not found");

  return result.rows[0];
};

export const updateAuthor = async (
  id: number,
  data: UpdateAuthorInput
): Promise<Author> => {
  const { name, profile, email, password, role } = data;
  const authorCheck = await pool.query(
    `SELECT id FROM authors WHERE id=$1 AND deleted_at IS NULL`,
    [id]
  );
  if (authorCheck.rowCount === 0) {
    throw new Error(`Author with id ${id} does not exist`);
  }

  const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

  const result = await pool.query(
    `UPDATE authors SET name=COALESCE($1,name), profile=COALESCE($2,profile), email = COALESCE($3,email),
       password = COALESCE($4,password),
       role = COALESCE($5,role) WHERE id=$6 and deleted_at IS NULL RETURNING *`,
    [name, profile, email, hashedPassword, role, id]
  );

  return result.rows[0];
};

export const deleteAuthor = async (id: number): Promise<boolean> => {
  const authorCheck = await pool.query(
    `SELECT id FROM authors WHERE id=$1 AND deleted_at IS NULL`,
    [id]
  );
  if (authorCheck.rowCount === 0) {
    throw new Error(`Author with id ${id} does not exist`);
  }
  const result = await pool.query(
    `UPDATE authors SET deleted_at= NOW() WHERE id=$1 AND deleted_at IS NULL`,
    [id]
  );
  return (result.rowCount ?? 0) > 0;
};
