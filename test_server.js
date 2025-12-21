import dotenv from 'dotenv'
import { pool } from './server/config/db.js'

dotenv.config()

console.log('Testing server configuration...')
console.log('DB_HOST:', process.env.DB_HOST)
console.log('DB_NAME:', process.env.DB_NAME)
console.log('DB_USER:', process.env.DB_USER)
console.log('DB_PORT:', process.env.DB_PORT)
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***set***' : 'NOT SET')

console.log('\nTesting database connection...')
try {
  const result = await pool.query('SELECT NOW()')
  console.log('✅ Database connection successful!')
  console.log('Database time:', result.rows[0].now)
  
  // Check if database exists
  const dbCheck = await pool.query("SELECT datname FROM pg_database WHERE datname = 'pest_control'")
  if (dbCheck.rows.length > 0) {
    console.log('✅ Database "pest_control" exists')
  } else {
    console.log('❌ Database "pest_control" does NOT exist')
    console.log('Please create it first: CREATE DATABASE pest_control;')
  }
  
  await pool.end()
} catch (error) {
  console.error('❌ Database connection failed:')
  console.error(error.message)
  await pool.end()
  process.exit(1)
}

