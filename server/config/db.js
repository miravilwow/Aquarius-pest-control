import pkg from 'pg'
const { Pool } = pkg
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Get current directory and load .env from server directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const serverDir = dirname(__dirname) // Go up one level from config/ to server/
dotenv.config({ path: join(serverDir, '.env') })

export const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'pest_control',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
})

// Test connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database')
})

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

