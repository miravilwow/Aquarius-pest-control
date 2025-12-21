import express from 'express'
import { pool } from '../config/db.js'
import { authenticateToken } from '../middleware/auth.js'
import { BookingController } from '../controllers/BookingController.js'
import { ServiceController } from '../controllers/ServiceController.js'
import { CustomerController } from '../controllers/CustomerController.js'

const router = express.Router()

// All admin routes require authentication
router.use(authenticateToken)

// Initialize controllers
const bookingController = new BookingController(pool)
const serviceController = new ServiceController(pool)
const customerController = new CustomerController(pool)

// Booking routes
router.get('/bookings', bookingController.getAll)
router.put('/bookings/:id', bookingController.updateStatus)

// Service routes
router.post('/services', serviceController.create)
router.put('/services/:id', serviceController.update)
router.delete('/services/:id', serviceController.delete)

// Customer routes
router.get('/customers', customerController.getAll)

export default router
