import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import './Contact.css'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const phoneNumber = '09265557359'
  const email = 'rodolfomiravil65@gmail.com'

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleServiceChange = (value) => {
    setFormData({ ...formData, service: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    setTimeout(() => {
      alert('Thank you for your message! We will contact you soon.')
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: ''
      })
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <div className="contact-hero-content">
            <div className="contact-badge">
              <MessageSquare size={16} />
              <span>Get in Touch</span>
            </div>
            <h1 className="contact-hero-title">Contact Us</h1>
            <p className="contact-hero-subtitle">
              We're here to help! Reach out to us through any of the channels below.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content - Single Card with Contact Info and Form */}
      <div className="container contact-container">
        <Card className="contact-main-card">
          <CardHeader>
            <CardTitle className="contact-main-title">Send us a Message</CardTitle>
            <CardDescription>
              Fill out the form below and we'll get back to you within 24 hours
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {/* Contact Information Section - Top of Form */}
            <div className="contact-info-section">
              <div className="contact-info-header">
                <h3 className="contact-info-title">Quick Contact</h3>
                <p className="contact-info-subtitle">Reach us directly or fill out the form below</p>
              </div>
              
              <div className="contact-info-grid">
                <Button
                  asChild
                  variant="outline"
                  className="contact-action-btn phone-btn"
                  size="lg"
                >
                  <a href={`tel:${phoneNumber}`}>
                    <Phone size={20} />
                    <div className="btn-content">
                      <span className="btn-label">Call Us</span>
                      <span className="btn-value">{phoneNumber}</span>
                    </div>
                    <ExternalLink size={16} className="btn-icon" />
                  </a>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="contact-action-btn email-btn"
                  size="lg"
                >
                  <a href={`mailto:${email}`}>
                    <Mail size={20} />
                    <div className="btn-content">
                      <span className="btn-label">Email Us</span>
                      <span className="btn-value">{email}</span>
                    </div>
                    <ExternalLink size={16} className="btn-icon" />
                  </a>
                </Button>

                <div className="contact-info-item">
                  <MapPin size={18} />
                  <div className="info-content">
                    <span className="info-label">Location</span>
                    <span className="info-value">Bulacan Branch</span>
                  </div>
                </div>

                <div className="contact-info-item">
                  <Clock size={18} />
                  <div className="info-content">
                    <span className="info-label">Business Hours</span>
                    <span className="info-value">Mon-Sun: 8AM - 6PM</span>
                    <span className="info-hint">24/7 Emergency Available</span>
                  </div>
                </div>
              </div>

              <Button asChild className="w-full free-inspection-btn" size="lg">
                <Link to="/booking">
                  <MessageSquare size={18} />
                  Book Free Inspection
                </Link>
              </Button>
            </div>

            <Separator className="my-6" />

            {/* Contact Form */}
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="09XX XXX XXXX"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <Label htmlFor="service">Service Needed *</Label>
                  <Select value={formData.service} onValueChange={handleServiceChange} required>
                    <SelectTrigger id="service">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent side="bottom" position="popper">
                      <SelectItem value="termite">Termite Control</SelectItem>
                      <SelectItem value="cockroach">Cockroach Control</SelectItem>
                      <SelectItem value="rodent">Rodent Control</SelectItem>
                      <SelectItem value="bedbug">Bedbug Control</SelectItem>
                      <SelectItem value="ant">Ant Control</SelectItem>
                      <SelectItem value="general">General Pest Control</SelectItem>
                      <SelectItem value="inspection">Free Inspection</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="form-group">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell us about your pest control needs..."
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Contact
