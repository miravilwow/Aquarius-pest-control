import { pool } from '../config/db.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcryptjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function initDatabase() {
  try {
    console.log('Initializing database...')

    // Read and execute schema
    const schemaPath = path.join(__dirname, 'schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')
    
    // Split by semicolons and execute each statement
    const statements = schema.split(';').filter(s => s.trim().length > 0)
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await pool.query(statement)
        } catch (error) {
          // Ignore errors for existing tables/indexes
          if (!error.message.includes('already exists')) {
            console.error('Error executing statement:', error.message)
          }
        }
      }
    }

    // Create default admin
    const adminPassword = await bcrypt.hash('admin123', 10)
    await pool.query(
      `INSERT INTO admins (username, password_hash) 
       VALUES ('admin', $1)
       ON CONFLICT (username) DO NOTHING`,
      [adminPassword]
    )

    // Insert default services
    const defaultServices = [
      ['Ant Control', 'Effective ant elimination and prevention', 150.00],
      ['Roach Control', 'Complete roach removal services', 200.00],
      ['Rodent Control', 'Safe rodent removal and prevention', 250.00],
      ['Termite Control', 'Professional termite treatment', 300.00]
    ]

    for (const [name, description, price] of defaultServices) {
      await pool.query(
        `INSERT INTO services (name, description, price) 
         VALUES ($1, $2, $3)
         ON CONFLICT DO NOTHING`,
        [name, description, price]
      )
    }

    console.log('Database initialized successfully!')
    console.log('Default admin credentials:')
    console.log('Username: admin')
    console.log('Password: admin123')
  } catch (error) {
    console.error('Error initializing database:', error)
  } finally {
    await pool.end()
  }
}

initDatabase()

