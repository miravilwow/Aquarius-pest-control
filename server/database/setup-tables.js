/**
 * Creates admins, services, and bookings tables + default services + admin user.
 * Run: node server/database/setup-tables.js
 * (from project root: node server/database/setup-tables.js)
 */
import { pool } from '../config/db.js'
import bcrypt from 'bcryptjs'

async function setup() {
  try {
    console.log('Creating tables and seed data...\n')

    // 1. Admins
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)
    console.log('  admins: OK')

    // 2. Services
    await pool.query(`
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)
    console.log('  services: OK')

    // 3. Bookings
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        address TEXT NOT NULL,
        service_id INTEGER REFERENCES services(id),
        preferred_date DATE NOT NULL,
        preferred_time TIME NOT NULL,
        message TEXT,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)
    console.log('  bookings: OK')

    // 4. Indexes
    await pool.query('CREATE INDEX IF NOT EXISTS idx_bookings_service_id ON bookings(service_id);')
    await pool.query('CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);')
    await pool.query('CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);')
    console.log('  indexes: OK')

    // 5. Default services (only if empty)
    const count = await pool.query('SELECT COUNT(*) FROM services')
    if (parseInt(count.rows[0].count, 10) === 0) {
      await pool.query(`
        INSERT INTO services (name, description, price) VALUES
        ('Ant Control', 'Effective ant elimination and prevention', 150.00),
        ('Roach Control', 'Complete roach removal services', 200.00),
        ('Rodent Control', 'Safe rodent removal and prevention', 250.00),
        ('Termite Control', 'Professional termite treatment', 300.00);
      `)
      console.log('  default services: inserted')
    } else {
      console.log('  default services: already exist')
    }

    // 6. Admin user (create or reset password)
    const adminCheck = await pool.query("SELECT id FROM admins WHERE username = 'admin'")
    const hash = await bcrypt.hash('admin123', 10)
    if (adminCheck.rows.length === 0) {
      await pool.query(
        'INSERT INTO admins (username, password_hash) VALUES ($1, $2)',
        ['admin', hash]
      )
      console.log('  admin user: created')
    } else {
      await pool.query(
        'UPDATE admins SET password_hash = $1 WHERE username = $2',
        [hash, 'admin']
      )
      console.log('  admin user: password reset')
    }

    console.log('\nDone. Use: username=admin, password=admin123\n')
  } catch (e) {
    console.error('Error:', e.message)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

setup()
