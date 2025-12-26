import { useState, useEffect } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Calendar, Clock, User, Mail, Phone, MapPin, MessageSquare, CheckCircle2, AlertCircle } from 'lucide-react'
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
  const [backendError, setBackendError] = useState(false)

  useEffect(() => {
    fetchServices()
  }, [])

  const getDefaultServices = () => [
    { id: 1, name: 'Termite Control', price: 300 },
    { id: 2, name: 'General Pest Control', price: 250 },
    { id: 3, name: 'Rodent Control', price: 350 },
    { id: 4, name: 'Bedbug Treatment', price: 400 },
    { id: 5, name: 'Mosquito Control', price: 200 },
    { id: 6, name: 'Cockroach Control', price: 250 },
    { id: 7, name: 'Ant Control', price: 200 },
    { id: 8, name: 'Inspection & Consultation', price: 0 }
  ]

  const fetchServices = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/services')
      setServices(response.data.length > 0 ? response.data : getDefaultServices())
      setBackendError(false)
    } catch (error) {
      // Silently use default services if backend is not available
      setServices(getDefaultServices())
      setBackendError(true)
      // Only log if it's not a connection refused error
      if (error.code !== 'ERR_NETWORK' && error.code !== 'ECONNREFUSED') {
        console.error('Error fetching services:', error)
      }
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
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
        setMessage('Backend server is not running. Please contact us directly at 09265557359 or rodolfomiravil65@gmail.com')
      } else {
        setMessage(error.response?.data?.message || 'Error submitting booking. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="booking-page-modern">
      {/* Hero Section */}
      <div className="booking-hero">
        <div className="container">
          <div className="booking-hero-content">
            <h1 className="booking-hero-title">Book Your Service</h1>
            <p className="booking-hero-subtitle">Fill out the form below and we'll get back to you within 24 hours</p>
            <Separator className="w-24 mx-auto mt-4 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
          </div>
        </div>
      </div>

      <div className="container booking-container">
        {backendError && (
          <Card className="booking-warning-card mb-6 border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-yellow-600 mt-0.5" size={20} />
                <div>
                  <p className="font-semibold text-yellow-800">Backend Server Not Running</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Using default services. To enable full functionality, please start the backend server.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="booking-form-wrapper">
          <Card className="booking-form-card">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Calendar className="text-blue-600" size={24} />
                Booking Information
              </CardTitle>
              <CardDescription>Please provide your details to schedule a service</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="booking-form-modern">
                <div className="form-grid">
                  <div className="form-field-group">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User size={16} />
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                      className="mt-1"
                    />
                  </div>

                  <div className="form-field-group">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail size={16} />
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      required
                      className="mt-1"
                    />
                  </div>

                  <div className="form-field-group">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone size={16} />
                      Phone *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="09XX XXX XXXX"
                      required
                      className="mt-1"
                    />
                  </div>

                  <div className="form-field-group">
                    <Label htmlFor="address" className="flex items-center gap-2">
                      <MapPin size={16} />
                      Address *
                    </Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter your complete address"
                      required
                      rows={3}
                      className="mt-1"
                    />
                  </div>

                  <div className="form-field-group">
                    <Label htmlFor="service_id" className="flex items-center gap-2">
                      <CheckCircle2 size={16} />
                      Service *
                    </Label>
                    <Select
                      name="service_id"
                      value={formData.service_id}
                      onValueChange={(value) => setFormData({ ...formData, service_id: value })}
                      required
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map(service => (
                          <SelectItem key={service.id} value={service.id.toString()}>
                            {service.name} - ₱{service.price}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="form-field-group">
                    <Label htmlFor="preferred_date" className="flex items-center gap-2">
                      <Calendar size={16} />
                      Preferred Date *
                    </Label>
                    <Input
                      id="preferred_date"
                      type="date"
                      name="preferred_date"
                      value={formData.preferred_date}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="mt-1"
                    />
                  </div>

                  <div className="form-field-group">
                    <Label htmlFor="preferred_time" className="flex items-center gap-2">
                      <Clock size={16} />
                      Preferred Time *
                    </Label>
                    <Select
                      name="preferred_time"
                      value={formData.preferred_time}
                      onValueChange={(value) => setFormData({ ...formData, preferred_time: value })}
                      required
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="09:00">9:00 AM</SelectItem>
                        <SelectItem value="10:00">10:00 AM</SelectItem>
                        <SelectItem value="11:00">11:00 AM</SelectItem>
                        <SelectItem value="13:00">1:00 PM</SelectItem>
                        <SelectItem value="14:00">2:00 PM</SelectItem>
                        <SelectItem value="15:00">3:00 PM</SelectItem>
                        <SelectItem value="16:00">4:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="form-field-group full-width">
                    <Label htmlFor="message" className="flex items-center gap-2">
                      <MessageSquare size={16} />
                      Additional Message
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Any additional information or special requests..."
                      rows={4}
                      className="mt-1"
                    />
                  </div>
                </div>

                {message && (
                  <Card className={`mt-6 ${message.includes('success') ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        {message.includes('success') ? (
                          <CheckCircle2 className="text-green-600 mt-0.5" size={20} />
                        ) : (
                          <AlertCircle className="text-red-600 mt-0.5" size={20} />
                        )}
                        <p className={message.includes('success') ? 'text-green-800' : 'text-red-800'}>
                          {message}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Button
                  type="submit"
                  disabled={submitting}
                  size="lg"
                  className="w-full mt-6 booking-submit-btn"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={18} />
                      Submit Booking Request
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Booking

