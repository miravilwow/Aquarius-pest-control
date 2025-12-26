import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { pool } from './config/db.js'
import authRoutes from './routes/auth.js'
import serviceRoutes from './routes/services.js'
import bookingRoutes from './routes/bookings.js'
import adminRoutes from './routes/admin.js'
import contactRoutes from './routes/contact.js'

// Get current directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load .env file from server directory
dotenv.config({ path: join(__dirname, '.env') })

// Import Firebase config to initialize it (after .env is loaded)
import './config/firebase.js'

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/contact', contactRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' })
})

// Test database connection
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()')
    res.json({ status: 'OK', message: 'Database connected', time: result.rows[0].now })
  } catch (error) {
    res.status(500).json({ status: 'ERROR', message: error.message })
  }
})

// Test database connection on startup
async function testDatabaseConnection() {
  try {
    const result = await pool.query('SELECT NOW()')
    console.log('✅ Connected to PostgreSQL database')
    console.log(`   Database: ${process.env.DB_NAME || 'pest_control'}`)
    console.log(`   Server time: ${result.rows[0].now}`)
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    console.error('   Please check your .env file and PostgreSQL service')
  }
}

app.listen(PORT, async () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
  await testDatabaseConnection()
})

