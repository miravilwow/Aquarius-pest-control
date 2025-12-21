import express from 'express'
import { pool } from '../config/db.js'
import { BookingController } from '../controllers/BookingController.js'

const router = express.Router()
const bookingController = new BookingController(pool)

// Public route - create booking
router.post('/', bookingController.create)

export default router
