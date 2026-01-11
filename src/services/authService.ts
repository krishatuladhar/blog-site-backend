import pool from "../config/db";
import { userType, registerUserInput } from "../types/userType";
import bcrypt from "bcrypt";
import { findUserByEmailService } from "./userService";

export const registerUserService = async (
  data: registerUserInput,
  isRegister = false
): Promise<userType> => {
  const { name, profile, email, password, role } = data;
  const nameCheck = await pool.query(
    `SELECT id FROM users WHERE name=$1 AND deleted_at IS NULL`,
    [name]
  );
  if ((nameCheck.rowCount ?? 0) > 0) {
    throw new Error(`User with name "${name}" already exists`);
  }

  if (isRegister && email) {
    const existing = await findUserByEmailService(email);
    if (existing) throw new Error(`Email "${email}" already exists`);
  }

  const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
  const result = await pool.query(
    `INSERT INTO users (name, profile,email,password,role) VALUES($1, $2, $3,$4,$5) RETURNING * `,
    [name, profile ?? null, email, hashedPassword, role ?? "user"]
  );
  const user = { ...result.rows[0] };
  delete user.password;
  return user;
};
export const loginUserService = async (
  email: string,
  password: string
): Promise<userType | null> => {
  const user = await findUserByEmailService(email);
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return null;

  delete user.password;
  return user;
};
