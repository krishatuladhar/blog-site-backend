import pool from "../config/db";
import {
  Author,
  CreateAuthorInput,
  UpdateAuthorInput,
} from "../types/authorTypes";
import { v4 as uuidv4 } from "uuid";

export const createAuthor = async (
  data: CreateAuthorInput
): Promise<Author> => {
  const { name, profile } = data;
  const nameCheck = await pool.query(`SELECT id FROM authors WHERE name=$1`, [
    name,
  ]);
  if ((nameCheck.rowCount ?? 0) > 0) {
    throw new Error(`Author with name "${name}" already exists`);
  }

  const result = await pool.query(
    `INSERT INTO authors (name, profile) VALUES($1, $2) RETURNING * `,
    [name, profile ?? null]
  );
  return result.rows[0];
};

export const getAuthor = async (id: number): Promise<Author[]> => {
  const result = await pool.query(
    `SELECT * FROM authors WHERE id = $1 ORDER BY created_at DESC`,
    [id]
  );
  return result.rows[0];
};

export const updateAuthor = async (
  id: number,
  data: UpdateAuthorInput
): Promise<Author> => {
  const { name, profile } = data;
  const authorCheck = await pool.query(`SELECT id FROM authors WHERE id=$1`, [
    id,
  ]);
  if (authorCheck.rowCount === 0) {
    throw new Error(`Author with id ${id} does not exist`);
  }

  const result = await pool.query(
    `UPDATE authors SET name=COALESCE($1,name), profile=COALESCE($2,profile) WHERE id=$3 RETURNING *`,
    [name, profile, id]
  );

  return result.rows[0];
};

export const deleteAuthor = async (id: number): Promise<boolean> => {
  const authorCheck = await pool.query(`SELECT id FROM authors WHERE id=$1`, [
    id,
  ]);
  if (authorCheck.rowCount === 0) {
    throw new Error(`Author with id ${id} does not exist`);
  }
  const result = await pool.query(`DELETE FROM authors WHERE id=$1`, [id]);
  return (result.rowCount ?? 0) > 0;
};
