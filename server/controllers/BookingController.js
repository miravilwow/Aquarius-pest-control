import { BookingService } from '../services/BookingService.js'

/**
 * Booking Controller
 * Handles HTTP requests for bookings
 */
export class BookingController {
  constructor(pool) {
    this.bookingService = new BookingService(pool)
  }

  /**
   * Create a new booking
   */
  create = async (req, res) => {
    try {
      const booking = await this.bookingService.createBooking(req.body)
      res.status(201).json({ message: 'Booking created successfully', booking })
    } catch (error) {
      console.error('Error creating booking:', error)
      res.status(400).json({ message: error.message || 'Error creating booking' })
    }
  }

  /**
   * Get all bookings (admin only)
   */
  getAll = async (req, res) => {
    try {
      const bookings = await this.bookingService.getAllBookings()
      res.json(bookings)
    } catch (error) {
      console.error('Error fetching bookings:', error)
      res.status(500).json({
        message: 'Error fetching bookings',
        detail: error.message
      })
    }
  }

  /**
   * Update booking status (admin only)
   */
  updateStatus = async (req, res) => {
    try {
      const { id } = req.params
      const { status } = req.body
      
      const booking = await this.bookingService.updateBookingStatus(id, status)
      
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' })
      }
      
      res.json({ message: 'Booking updated successfully', booking })
    } catch (error) {
      console.error('Error updating booking:', error)
      res.status(400).json({ message: error.message || 'Error updating booking' })
    }
  }
}

