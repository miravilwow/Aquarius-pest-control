import { pool } from '../config/db.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcryptjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function executeSQLFile(filePath) {
  try {
    const sql = fs.readFileSync(filePath, 'utf8')
    const statements = sql.split(';').filter(s => s.trim().length > 0 && !s.trim().startsWith('--'))
    
    for (const statement of statements) {
      const trimmed = statement.trim()
      if (trimmed && !trimmed.startsWith('--')) {
        try {
          await pool.query(trimmed)
        } catch (error) {
          // Ignore errors for existing tables/indexes/columns
          if (!error.message.includes('already exists') && 
              !error.message.includes('duplicate') &&
              !error.message.includes('does not exist')) {
            console.warn(`Warning executing ${path.basename(filePath)}:`, error.message)
          }
        }
      }
    }
    console.log(`✅ Executed: ${path.basename(filePath)}`)
  } catch (error) {
    console.error(`❌ Error reading ${filePath}:`, error.message)
  }
}

async function initDatabase() {
  try {
    console.log('🚀 Initializing database...\n')

    // 1. Execute main schema
    console.log('📋 Step 1: Creating main schema...')
    await executeSQLFile(path.join(__dirname, 'schema.sql'))

    // 2. Add users table
    console.log('\n📋 Step 2: Adding users table...')
    await executeSQLFile(path.join(__dirname, 'add_users_table.sql'))

    // 3. Create OTP table
    console.log('\n📋 Step 3: Creating OTP table...')
    await executeSQLFile(path.join(__dirname, 'create_otp_table.sql'))

    // 4. Fix bookings table (add missing columns)
    console.log('\n📋 Step 4: Fixing bookings table...')
    await executeSQLFile(path.join(__dirname, 'fix_bookings_table.sql'))

    // 5. Fix client_name column
    console.log('\n📋 Step 5: Fixing client_name column...')
    await executeSQLFile(path.join(__dirname, 'fix_client_name.sql'))

    // 6. Create default admin
    console.log('\n📋 Step 6: Creating default admin user...')
    const adminPassword = await bcrypt.hash('admin123', 10)
    await pool.query(
      `INSERT INTO admins (username, password_hash) 
       VALUES ('admin', $1)
       ON CONFLICT (username) DO NOTHING`,
      [adminPassword]
    )
    console.log('✅ Default admin created')

    // 7. Insert default services (if not already updated)
    console.log('\n📋 Step 7: Checking services...')
    const servicesCheck = await pool.query('SELECT COUNT(*) FROM services')
    if (servicesCheck.rows[0].count === '0') {
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
      console.log('✅ Default services inserted')
    } else {
      console.log('✅ Services already exist')
    }

    console.log('\n✨ Database initialized successfully!')
    console.log('\n📝 Default admin credentials:')
    console.log('   Username: admin')
    console.log('   Password: admin123')
    console.log('\n⚠️  Please change the admin password after first login!')
    
  } catch (error) {
    console.error('❌ Error initializing database:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

initDatabase()
