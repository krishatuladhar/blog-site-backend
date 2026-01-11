import pool from "../config/db";
import { userType, updateUserInput } from "../types/userType";
import bcrypt from "bcrypt";

export const findUserByEmailService = async (email: string) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE email = $1 AND  deleted_at IS NULL ORDER BY created_at DESC`,
    [email]
  );
  return result.rows[0] || null;
};
export const findUserByIdService = async (id: number) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE id = $1 AND  deleted_at IS NULL ORDER BY created_at DESC`,
    [id]
  );
  return result.rows[0] || null;
};
export const getUserService = async (id: number): Promise<userType> => {
  const user = await findUserByIdService(id);
  if (!user) {
    throw new Error(`User with id ${id} does not exist`);
  }

  return user;
};
export const updateUserService = async (
  id: number,
  data: updateUserInput
): Promise<userType> => {
  const { name, profile, email, password, role } = data;
  const authorCheck = await findUserByIdService(id);
  if (!authorCheck) {
    throw new Error(`User with id ${id} does not exist`);
  }
  const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

  const result = await pool.query(
    `UPDATE users SET name=COALESCE($1,name), profile=COALESCE($2,profile), email = COALESCE($3,email),
       password = COALESCE($4,password),
       role = COALESCE($5,role) WHERE id=$6 and deleted_at IS NULL RETURNING *`,
    [name, profile, email, hashedPassword, role, id]
  );

  return result.rows[0];
};

export const deleteUserService = async (id: number): Promise<boolean> => {
  const userCheck = await findUserByIdService(id);
  if (!userCheck) {
    throw new Error(`Author with id ${id} does not exist`);
  }
  const result = await pool.query(
    `UPDATE users SET deleted_at= NOW() WHERE id=$1 AND deleted_at IS NULL`,
    [id]
  );
  return (result.rowCount ?? 0) > 0;
};

export const upgradeUserService = async (id: number) => {
  const user = await findUserByIdService(id);
  if (!user) throw new Error(`User with id ${id} does not exist`);

  if (user.role === "author") throw new Error("User is already an author");

  const result = await pool.query(
    `UPDATE users SET role = $1 WHERE id = $2 AND deleted_at IS NULL RETURNING *`,
    ["author", id]
  );

  return result.rows[0];
};
