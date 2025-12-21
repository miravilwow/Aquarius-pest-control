import { BaseModel } from './BaseModel.js'

/**
 * Booking Model
 * Handles all database operations for bookings
 */
export class BookingModel extends BaseModel {
  constructor(pool) {
    super(pool, 'bookings')
  }

  /**
   * Get all bookings with service information
   * @returns {Promise<Array>} Array of bookings with service names
   */
  async getAllWithServices() {
    const query = `
      SELECT b.*, s.name as service_name 
      FROM bookings b 
      LEFT JOIN services s ON b.service_id = s.id 
      ORDER BY b.created_at DESC
    `
    return await this.query(query)
  }

  /**
   * Create a new booking
   * @param {Object} bookingData - Booking data
   * @returns {Promise<Object>} Created booking
   */
  async createBooking(bookingData) {
    const { name, email, phone, address, service_id, preferred_date, preferred_time, message } = bookingData
    
    if (!name || !email || !phone || !address || !service_id || !preferred_date || !preferred_time) {
      throw new Error('All required fields must be provided')
    }

    return await this.create({
      name,
      email,
      phone,
      address,
      service_id: parseInt(service_id),
      preferred_date,
      preferred_time,
      message: message || '',
      status: 'pending'
    })
  }

  /**
   * Update booking status
   * @param {number} id - Booking ID
   * @param {string} status - New status
   * @returns {Promise<Object|null>} Updated booking or null
   */
  async updateStatus(id, status) {
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled']
    
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status')
    }

    return await this.update(id, { status })
  }
}

