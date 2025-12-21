import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { pool } from './config/db.js'
import authRoutes from './routes/auth.js'
import serviceRoutes from './routes/services.js'
import bookingRoutes from './routes/bookings.js'
import adminRoutes from './routes/admin.js'

dotenv.config()

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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

