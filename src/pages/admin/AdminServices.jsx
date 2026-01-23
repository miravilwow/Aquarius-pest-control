import { useState, useEffect } from 'react'
import axios from 'axios'
import { Field, FieldLabel } from '@/components/ui/field'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('adminToken')
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/admin/services/${editingId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      } else {
        await axios.post(
          'http://localhost:5000/api/admin/services',
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      }
      fetchServices()
      setShowForm(false)
      setFormData({ name: '', description: '', price: '' })
      setEditingId(null)
    } catch (error) {
      console.error('Error saving service:', error)
      alert('Error saving service')
    }
  }

  const handleEdit = (service) => {
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price
    })
    setEditingId(service.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('adminToken')
      await axios.delete(
        `http://localhost:5000/api/admin/services/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchServices()
    } catch (error) {
      console.error('Error deleting service:', error)
      alert('Error deleting service')
    }
  }

  const handleConfirmDelete = async () => {
    if (!serviceToDelete) return
    await handleDelete(serviceToDelete.id)
    setServiceToDelete(null)
  }

  if (loading) {
    return <div className="loading">Loading services...</div>
  }

  return (
    <div className="admin-services">
      <div className="services-header">
        <h1>Services Management</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-add">
          {showForm ? 'Cancel' : 'Add New Service'}
        </button>
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
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Field>
          </div>
          <div className="form-group">
            <Field>
              <FieldLabel htmlFor="service-description">Description *</FieldLabel>
              <textarea
                id="service-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows="3"
              />
            </Field>
          </div>
          <div className="form-group">
            <Field>
              <FieldLabel htmlFor="service-price">Price (₱) *</FieldLabel>
              <input
                id="service-price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                min="0"
                step="0.01"
              />
            </Field>
          </div>
          <button type="submit" className="btn-submit">
            {editingId ? 'Update Service' : 'Add Service'}
          </button>
        </form>
      )}

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

      <Dialog
        open={!!serviceToDelete}
        onOpenChange={(open) => {
          if (!open) setServiceToDelete(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete service</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{' '}
              <strong>{serviceToDelete?.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => setServiceToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              type="button"
              onClick={handleConfirmDelete}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminServices

