import { BaseModel } from './BaseModel.js'

/**
 * Service Model
 * Handles all database operations for services
 */
export class ServiceModel extends BaseModel {
  constructor(pool) {
    super(pool, 'services')
  }

  /**
   * Get all services ordered by name
   * @returns {Promise<Array>} Array of services
   */
  async getAll() {
    return await this.findAll({ orderBy: 'name ASC' })
  }

  /**
   * Create a new service
   * @param {Object} serviceData - Service data
   * @returns {Promise<Object>} Created service
   */
  async createService(serviceData) {
    const { name, description, price } = serviceData
    
    if (!name || !description || price === undefined) {
      throw new Error('Name, description, and price are required')
    }

    return await this.create({
      name,
      description,
      price: parseFloat(price)
    })
  }

  /**
   * Update a service
   * @param {number} id - Service ID
   * @param {Object} serviceData - Updated service data
   * @returns {Promise<Object|null>} Updated service or null
   */
  async updateService(id, serviceData) {
    const { name, description, price } = serviceData
    
    const updateData = {}
    if (name) updateData.name = name
    if (description) updateData.description = description
    if (price !== undefined) updateData.price = parseFloat(price)

    return await this.update(id, updateData)
  }
}

