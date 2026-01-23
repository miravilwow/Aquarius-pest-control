import { CustomerService } from '../services/CustomerService.js'

/**
 * Customer Controller
 * Handles HTTP requests for customers
 */
export class CustomerController {
  constructor(pool) {
    this.customerService = new CustomerService(pool)
  }

  /**
   * Get all customers
   */
  getAll = async (req, res) => {
    try {
      const customers = await this.customerService.getAllCustomers()
      res.json(customers)
    } catch (error) {
      console.error('Error fetching customers:', error)
      res.status(500).json({
        message: 'Error fetching customers',
        detail: error.message
      })
    }
  }
}

