import { ServiceModel } from '../models/ServiceModel.js'

/**
 * Service Service
 * Business logic for services
 */
export class ServiceService {
  constructor(pool) {
    this.serviceModel = new ServiceModel(pool)
  }

  /**
   * Get all services
   * @returns {Promise<Array>} Array of services
   */
  async getAllServices() {
    return await this.serviceModel.getAll()
  }

  /**
   * Get service by ID
   * @param {number} id - Service ID
   * @returns {Promise<Object|null>} Service or null
   */
  async getServiceById(id) {
    return await this.serviceModel.findById(id)
  }

  /**
   * Create a new service
   * @param {Object} serviceData - Service data
   * @returns {Promise<Object>} Created service
   */
  async createService(serviceData) {
    return await this.serviceModel.createService(serviceData)
  }

  /**
   * Update a service
   * @param {number} id - Service ID
   * @param {Object} serviceData - Updated service data
   * @returns {Promise<Object|null>} Updated service or null
   */
  async updateService(id, serviceData) {
    return await this.serviceModel.updateService(id, serviceData)
  }

  /**
   * Delete a service
   * @param {number} id - Service ID
   * @returns {Promise<boolean>} True if deleted
   */
  async deleteService(id) {
    return await this.serviceModel.delete(id)
  }
}

