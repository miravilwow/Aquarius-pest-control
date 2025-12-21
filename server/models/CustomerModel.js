import { BaseModel } from './BaseModel.js'

/**
 * Customer Model
 * Handles all database operations for customers
 */
export class CustomerModel extends BaseModel {
  constructor(pool) {
    super(pool, 'bookings') // Customers are derived from bookings
  }

  /**
   * Get all unique customers with booking counts
   * @returns {Promise<Array>} Array of customers
   */
  async getAllCustomers() {
    const query = `
      SELECT DISTINCT 
        b.name, 
        b.email, 
        b.phone, 
        b.address,
        COUNT(b.id) as total_bookings
      FROM bookings b
      GROUP BY b.name, b.email, b.phone, b.address
      ORDER BY b.name ASC
    `
    
    const result = await this.query(query)
    
    return result.map((row, index) => ({
      id: index + 1,
      name: row.name,
      email: row.email,
      phone: row.phone,
      address: row.address,
      total_bookings: parseInt(row.total_bookings)
    }))
  }
}

