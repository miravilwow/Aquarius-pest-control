import pkg from 'pg'
const { Pool } = pkg
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Get current directory and load .env
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const serverDir = dirname(__dirname)
dotenv.config({ path: join(serverDir, '.env') })

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'pest_control',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
})

async function resetAdmin() {
  try {
    console.log('🔄 Resetting admin password...\n')
    
    // Check if admin exists
    const checkResult = await pool.query('SELECT * FROM admins WHERE username = $1', ['admin'])
    
    if (checkResult.rows.length > 0) {
      console.log('📋 Admin user found, updating password...')
      const adminPassword = await bcrypt.hash('admin123', 10)
      await pool.query(
        `UPDATE admins SET password_hash = $1 WHERE username = 'admin'`,
        [adminPassword]
      )
      console.log('✅ Admin password reset successfully!')
    } else {
      console.log('📋 Admin user not found, creating new admin...')
      const adminPassword = await bcrypt.hash('admin123', 10)
      await pool.query(
        `INSERT INTO admins (username, password_hash) VALUES ('admin', $1)`,
        [adminPassword]
      )
      console.log('✅ Admin user created successfully!')
    }
    
    console.log('\n📝 Admin credentials:')
    console.log('   Username: admin')
    console.log('   Password: admin123')
    console.log('\n✨ Done!')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error('Full error:', error)
  } finally {
    await pool.end()
  }
}

resetAdmin()
