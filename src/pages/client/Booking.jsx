import { useState, useEffect } from 'react'
import axios from 'axios'
import './Booking.css'

function Booking() {
  const [services, setServices] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    service_id: '',
    preferred_date: '',
    preferred_time: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/services')
      setServices(response.data)
    } catch (error) {
      console.error('Error fetching services:', error)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage('')

    try {
      const response = await axios.post('http://localhost:5000/api/bookings', formData)
      setMessage('Booking submitted successfully! We will contact you soon.')
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        service_id: '',
        preferred_date: '',
        preferred_time: '',
        message: ''
      })
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error submitting booking. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="booking-page">
      <div className="container">
        <h1>Book a Service</h1>
        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Address *</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Service *</label>
            <select
              name="service_id"
              value={formData.service_id}
              onChange={handleChange}
              required
            >
              <option value="">Select a service</option>
              {services.map(service => (
                <option key={service.id} value={service.id}>
                  {service.name} - ₱{service.price}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Preferred Date *</label>
              <input
                type="date"
                name="preferred_date"
                value={formData.preferred_date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="form-group">
              <label>Preferred Time *</label>
              <select
                name="preferred_time"
                value={formData.preferred_time}
                onChange={handleChange}
                required
              >
                <option value="">Select time</option>
                <option value="09:00">9:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="13:00">1:00 PM</option>
                <option value="14:00">2:00 PM</option>
                <option value="15:00">3:00 PM</option>
                <option value="16:00">4:00 PM</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Additional Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
            />
          </div>

          {message && (
            <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <button type="submit" disabled={submitting} className="btn-submit">
            {submitting ? 'Submitting...' : 'Submit Booking'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Booking

