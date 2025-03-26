import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,  // This should be 'db' according to Docker Compose
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432, 
});

export default {
  query: (text: string, params?: any[]) => pool.query(text, params),
  connect: () => pool.connect()
}