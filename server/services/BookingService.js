import { BookingModel } from '../models/BookingModel.js'

/**
 * Booking Service
 * Business logic for bookings
 */
export class BookingService {
  constructor(pool) {
    this.bookingModel = new BookingModel(pool)
  }

  /**
   * Get all bookings with service information
   * @returns {Promise<Array>} Array of bookings
   */
  async getAllBookings() {
    return await this.bookingModel.getAllWithServices()
  }

  /**
   * Get booking by ID
   * @param {number} id - Booking ID
   * @returns {Promise<Object|null>} Booking or null
   */
  async getBookingById(id) {
    return await this.bookingModel.findById(id)
  }

  /**
   * Create a new booking
   * @param {Object} bookingData - Booking data
   * @returns {Promise<Object>} Created booking
   */
  async createBooking(bookingData) {
    return await this.bookingModel.createBooking(bookingData)
  }

  /**
   * Update booking status
   * @param {number} id - Booking ID
   * @param {string} status - New status
   * @returns {Promise<Object|null>} Updated booking or null
   */
  async updateBookingStatus(id, status) {
    return await this.bookingModel.updateStatus(id, status)
  }
}

