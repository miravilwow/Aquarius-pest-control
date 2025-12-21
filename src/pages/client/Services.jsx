import { useState, useEffect } from 'react'
import axios from 'axios'
import './Services.css'

function Services() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/services')
      setServices(response.data)
    } catch (error) {
      console.error('Error fetching services:', error)
      // Fallback data if API fails
      setServices([
        { id: 1, name: 'Ant Control', description: 'Effective ant elimination and prevention', price: 150 },
        { id: 2, name: 'Roach Control', description: 'Complete roach removal services', price: 200 },
        { id: 3, name: 'Rodent Control', description: 'Safe rodent removal and prevention', price: 250 },
        { id: 4, name: 'Termite Control', description: 'Professional termite treatment', price: 300 }
      ])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading services...</div>
  }

  return (
    <div className="services-page">
      <div className="container">
        <h1>Our Pest Control Services</h1>
        <div className="services-list">
          {services.map(service => (
            <div key={service.id} className="service-item">
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <div className="service-price">₱{service.price}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Services

