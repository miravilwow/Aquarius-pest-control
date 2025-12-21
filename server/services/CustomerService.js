import { CustomerModel } from '../models/CustomerModel.js'

/**
 * Customer Service
 * Business logic for customers
 */
export class CustomerService {
  constructor(pool) {
    this.customerModel = new CustomerModel(pool)
  }

  /**
   * Get all customers
   * @returns {Promise<Array>} Array of customers
   */
  async getAllCustomers() {
    return await this.customerModel.getAllCustomers()
  }
}

