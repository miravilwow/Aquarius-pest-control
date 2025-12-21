import { ServiceService } from '../services/ServiceService.js'

/**
 * Service Controller
 * Handles HTTP requests for services
 */
export class ServiceController {
  constructor(pool) {
    this.serviceService = new ServiceService(pool)
  }

  /**
   * Get all services
   */
  getAll = async (req, res) => {
    try {
      const services = await this.serviceService.getAllServices()
      res.json(services)
    } catch (error) {
      console.error('Error fetching services:', error)
      res.status(500).json({ message: 'Error fetching services' })
    }
  }

  /**
   * Get service by ID
   */
  getById = async (req, res) => {
    try {
      const { id } = req.params
      const service = await this.serviceService.getServiceById(id)
      
      if (!service) {
        return res.status(404).json({ message: 'Service not found' })
      }
      
      res.json(service)
    } catch (error) {
      console.error('Error fetching service:', error)
      res.status(500).json({ message: 'Error fetching service' })
    }
  }

  /**
   * Create a new service
   */
  create = async (req, res) => {
    try {
      const service = await this.serviceService.createService(req.body)
      res.status(201).json({ message: 'Service created successfully', service })
    } catch (error) {
      console.error('Error creating service:', error)
      res.status(400).json({ message: error.message || 'Error creating service' })
    }
  }

  /**
   * Update a service
   */
  update = async (req, res) => {
    try {
      const { id } = req.params
      const service = await this.serviceService.updateService(id, req.body)
      
      if (!service) {
        return res.status(404).json({ message: 'Service not found' })
      }
      
      res.json({ message: 'Service updated successfully', service })
    } catch (error) {
      console.error('Error updating service:', error)
      res.status(400).json({ message: error.message || 'Error updating service' })
    }
  }

  /**
   * Delete a service
   */
  delete = async (req, res) => {
    try {
      const { id } = req.params
      const deleted = await this.serviceService.deleteService(id)
      
      if (!deleted) {
        return res.status(404).json({ message: 'Service not found' })
      }
      
      res.json({ message: 'Service deleted successfully' })
    } catch (error) {
      console.error('Error deleting service:', error)
      res.status(500).json({ message: 'Error deleting service' })
    }
  }
}

