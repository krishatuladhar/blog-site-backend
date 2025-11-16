import { Pool } from "pg";
import dotenv from "dotenv";

// Load .env variables
dotenv.config();

const pool = new Pool({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  port: Number(process.env.PG_PORT),
});

pool.on("connect", () => {
  console.log(" Connected to PostgreSQL");
});

export default pool;
