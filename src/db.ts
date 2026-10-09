import { Pool } from "pg";
import "dotenv/config";
import { env } from "./env.js";

const pool = new Pool({
  user: env.DB_USER,
  host: env.DB_HOST,
  database: env.DB_DATABASE,
  password: env.DB_PASSWORD,
  port: env.DB_PORT,
});

export default pool;