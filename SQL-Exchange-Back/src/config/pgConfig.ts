import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Exchange', 
  password: String(process.env.POSTGRESS_PASSWORD), 
  port: 5432, 
});

export default {
  query: (text: string, params?: any[]) => pool.query(text, params),
  connect: () => pool.connect()
}