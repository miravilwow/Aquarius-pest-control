import { useState, useEffect } from 'react'
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

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/services')
      setServices(response.data)
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
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
  }

  const handleSubmit = async (e) => {
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
        toast.success('Service updated successfully!', {
          description: `${formData.name} has been updated.`,
        })
        logActivity(ActivityType.SERVICE_UPDATED, {
          serviceName: formData.name,
          serviceId: editingId,
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
      fetchServices()
      setShowForm(false)
      setFormData({ name: '', description: '', price: '' })
      setFormErrors({ name: '', description: '', price: '' })
      setEditingId(null)
    } catch (error) {
      console.error('Error saving service:', error)
      toast.error('Error saving service', {
        description: error.response?.data?.message || 'Failed to save service. Please try again.',
      })
    }
  }

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: '' })
    }
  }

  const handleEdit = (service) => {
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price
    })
    setFormErrors({ name: '', description: '', price: '' })
    setEditingId(service.id)
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setFormData({ name: '', description: '', price: '' })
    setFormErrors({ name: '', description: '', price: '' })
    setEditingId(null)
  }

  const handleDelete = async (id, serviceName) => {
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
      fetchServices()
    } catch (error) {
      console.error('Error deleting service:', error)
      toast.error('Error deleting service', {
        description: error.response?.data?.message || 'Failed to delete service. Please try again.',
      })
    }
  }

  const handleConfirmDelete = async () => {
    if (!serviceToDelete) return
    const serviceName = serviceToDelete.name
    setServiceToDelete(null)
    await handleDelete(serviceToDelete.id, serviceName)
  }

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
    <div className="admin-services">
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
        <form onSubmit={handleSubmit} className="service-form">
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
              />
              {formErrors.name && (
                <span className="error-message">{formErrors.name}</span>
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
              />
              {formErrors.description && (
                <span className="error-message">{formErrors.description}</span>
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
              />
              {formErrors.price && (
                <span className="error-message">{formErrors.price}</span>
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

      <AlertDialog open={!!serviceToDelete} onOpenChange={(open) => {
        if (!open) setServiceToDelete(null)
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
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

export default AdminServices

