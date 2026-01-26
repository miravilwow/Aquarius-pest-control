import { useState, useEffect, useCallback, memo } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { logActivity, ActivityType } from '@/utils/activityLog'
import { Field, FieldLabel } from '@/components/ui/field'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Wrench, Plus } from 'lucide-react'
import './AdminServices.css'

// Admin Services Management Component
// Handles CRUD operations for pest control services
function AdminServices() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: ''
  })
  const [formErrors, setFormErrors] = useState({
    name: '',
    description: '',
    price: ''
  })
  const [editingId, setEditingId] = useState(null)
  const [serviceToDelete, setServiceToDelete] = useState(null)
  const [originalService, setOriginalService] = useState(null)

  const fetchServices = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/services')
      setServices(response.data)
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  /**
   * Validate service form data
   * @returns {boolean} True if form is valid, false otherwise
   */
  const validateForm = useCallback(() => {
    const errors = {
      name: '',
      description: '',
      price: ''
    }
    let isValid = true

    // Validate name
    if (!formData.name.trim()) {
      errors.name = 'Service name is required'
      isValid = false
    } else if (formData.name.trim().length < 3) {
      errors.name = 'Service name must be at least 3 characters'
      isValid = false
    }

    // Validate description
    if (!formData.description.trim()) {
      errors.description = 'Description is required'
      isValid = false
    } else if (formData.description.trim().length < 10) {
      errors.description = 'Description must be at least 10 characters'
      isValid = false
    }

    // Validate price
    if (!formData.price || formData.price === '') {
      errors.price = 'Price is required'
      isValid = false
    } else {
      const priceNum = parseFloat(formData.price)
      if (isNaN(priceNum) || priceNum <= 0) {
        errors.price = 'Price must be a positive number'
        isValid = false
      }
    }

    setFormErrors(errors)
    return isValid
  }, [formData])

  /**
   * Handle service form submission (create or update)
   * @async
   * @param {Event} e - Form submit event
   * @returns {Promise<void>}
   */
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    
    // Validate form before submitting
    if (!validateForm()) {
      toast.error('Please fix the form errors', {
        description: 'Check all fields and try again.',
      })
      return
    }

    try {
      const token = localStorage.getItem('adminToken')
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/admin/services/${editingId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        
        // Build detailed update message
        const changes = []
        if (originalService) {
          if (originalService.name !== formData.name) {
            changes.push(`Name: "${originalService.name}" → "${formData.name}"`)
          }
          if (originalService.description !== formData.description) {
            changes.push('Description updated')
          }
          if (parseFloat(originalService.price) !== parseFloat(formData.price)) {
            changes.push(`Price: ₱${parseFloat(originalService.price).toFixed(2)} → ₱${parseFloat(formData.price).toFixed(2)}`)
          }
        }
        
        const updateMessage = changes.length > 0 
          ? `Updated: ${changes.join(', ')}`
          : `${formData.name} has been updated.`
        
        toast.success('Service updated successfully!', {
          description: updateMessage,
          duration: 4000, // Show for 4 seconds
        })
        logActivity(ActivityType.SERVICE_UPDATED, {
          serviceName: formData.name,
          serviceId: editingId,
          changes: changes,
        })
      } else {
        await axios.post(
          'http://localhost:5000/api/admin/services',
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        toast.success('Service created successfully!', {
          description: `${formData.name} has been added.`,
        })
        logActivity(ActivityType.SERVICE_CREATED, {
          serviceName: formData.name,
        })
      }
      await fetchServices()
      setShowForm(false)
      setFormData({ name: '', description: '', price: '' })
      setFormErrors({ name: '', description: '', price: '' })
      setEditingId(null)
      setOriginalService(null) // Clear original service data
    } catch (error) {
      console.error('Error saving service:', error)
      toast.error('Error saving service', {
        description: error.response?.data?.message || 'Failed to save service. Please try again.',
      })
    }
  }, [editingId, formData, originalService, fetchServices, validateForm])

  /**
   * Handle input field changes and clear errors
   * @param {string} field - Field name (name, description, price)
   * @param {string} value - New field value
   */
  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    setFormErrors((prev) => {
      if (prev[field]) {
        return { ...prev, [field]: '' }
      }
      return prev
    })
  }, [])

  const handleEdit = useCallback((service) => {
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price
    })
    setFormErrors({ name: '', description: '', price: '' })
    setEditingId(service.id)
    setOriginalService({ ...service }) // Store original values for comparison
    setShowForm(true)
  }, [])

  const handleCancel = useCallback(() => {
    setShowForm(false)
    setFormData({ name: '', description: '', price: '' })
    setFormErrors({ name: '', description: '', price: '' })
    setEditingId(null)
    setOriginalService(null) // Clear original service data
  }, [])

  /**
   * Delete a service
   * @async
   * @param {number} id - Service ID
   * @param {string} serviceName - Service name (for notification)
   * @returns {Promise<void>}
   */
  const handleDelete = useCallback(async (id, serviceName) => {
    try {
      const token = localStorage.getItem('adminToken')
      await axios.delete(
        `http://localhost:5000/api/admin/services/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success('Service deleted successfully!', {
        description: `${serviceName} has been removed.`,
      })
      logActivity(ActivityType.SERVICE_DELETED, {
        serviceName: serviceName,
        serviceId: id,
      })
      await fetchServices()
    } catch (error) {
      console.error('Error deleting service:', error)
      toast.error('Error deleting service', {
        description: error.response?.data?.message || 'Failed to delete service. Please try again.',
      })
    }
  }, [fetchServices])

  /**
   * Confirm and execute service deletion
   * @async
   * @returns {Promise<void>}
   */
  const handleConfirmDelete = useCallback(async () => {
    if (!serviceToDelete) return
    const serviceName = serviceToDelete.name
    const serviceId = serviceToDelete.id
    setServiceToDelete(null)
    await handleDelete(serviceId, serviceName)
  }, [serviceToDelete, handleDelete])

  if (loading) {
    return (
      <div className="admin-services">
        <div className="services-header">
          <h1>Services Management</h1>
        </div>
        <div className="loading-container">
          <Skeleton className="h-12 w-full mb-4" />
          <div className="services-list-skeleton">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-services" role="main" aria-label="Services Management">
      {/* ARIA live region for dynamic updates */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {loading ? 'Loading services...' : `${services.length} service${services.length !== 1 ? 's' : ''} available`}
      </div>
      <div className="services-header">
        <h1>Services Management</h1>
        <Button onClick={() => {
          if (showForm) {
            handleCancel()
          } else {
            setShowForm(true)
          }
        }} variant={showForm ? "outline" : "default"}>
          {showForm ? 'Cancel' : 'Add New Service'}
        </Button>
      </div>

      {showForm && (
        <form 
          onSubmit={handleSubmit} 
          className="service-form"
          aria-label={editingId ? 'Edit service form' : 'Add new service form'}
          noValidate
        >
          <div className="form-group">
            <Field>
              <FieldLabel htmlFor="service-name">Service Name *</FieldLabel>
              <input
                id="service-name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={formErrors.name ? 'input-error' : ''}
                placeholder="e.g., General Pest Control"
                aria-invalid={!!formErrors.name}
                aria-describedby={formErrors.name ? 'service-name-error' : undefined}
              />
              {formErrors.name && (
                <span id="service-name-error" className="error-message" role="alert">{formErrors.name}</span>
              )}
            </Field>
          </div>
          <div className="form-group">
            <Field>
              <FieldLabel htmlFor="service-description">Description *</FieldLabel>
              <textarea
                id="service-description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={formErrors.description ? 'input-error' : ''}
                rows="3"
                placeholder="Describe the service in detail..."
                aria-invalid={!!formErrors.description}
                aria-describedby={formErrors.description ? 'service-description-error' : undefined}
              />
              {formErrors.description && (
                <span id="service-description-error" className="error-message" role="alert">{formErrors.description}</span>
              )}
            </Field>
          </div>
          <div className="form-group">
            <Field>
              <FieldLabel htmlFor="service-price">Price (₱) *</FieldLabel>
              <input
                id="service-price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className={formErrors.price ? 'input-error' : ''}
                min="0"
                step="0.01"
                placeholder="0.00"
                aria-invalid={!!formErrors.price}
                aria-describedby={formErrors.price ? 'service-price-error' : undefined}
              />
              {formErrors.price && (
                <span id="service-price-error" className="error-message" role="alert">{formErrors.price}</span>
              )}
            </Field>
          </div>
          <div className="form-actions">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {editingId ? 'Update Service' : 'Add Service'}
            </Button>
          </div>
        </form>
      )}

      {services.length > 0 ? (
        <div className="services-list">
          {services.map(service => (
            <div key={service.id} className="service-card">
              <div className="service-info">
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <div className="service-price">₱{service.price}</div>
              </div>
              <div className="service-actions">
                <button onClick={() => handleEdit(service)} className="btn-edit">Edit</button>
                <button onClick={() => setServiceToDelete(service)} className="btn-delete">Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state-container">
          <div className="empty-state">
            <Wrench className="empty-state-icon" />
            <h3 className="empty-state-title">No services yet</h3>
            <p className="empty-state-description">
              Get started by adding your first service. Services will appear here once created.
            </p>
            <Button
              onClick={() => setShowForm(true)}
              className="mt-4"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Service
            </Button>
          </div>
        </div>
      )}

      <AlertDialog 
        open={!!serviceToDelete} 
        onOpenChange={(open) => {
          if (!open) setServiceToDelete(null)
        }}
      >
        <AlertDialogContent aria-describedby="delete-service-description">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription id="delete-service-description">
              This action cannot be undone. This will permanently delete{' '}
              <strong>{serviceToDelete?.name}</strong> service.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setServiceToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// Memoize the component to prevent unnecessary re-renders
export default memo(AdminServices)

