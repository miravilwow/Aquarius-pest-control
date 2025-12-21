import { Link } from 'react-router-dom'
import './Home.css'

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <h1>Professional Pest Control Services</h1>
          <p>Protecting your home and business from unwanted pests</p>
          <Link to="/booking" className="btn-primary">Book Now</Link>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Why Choose Us?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">✓</div>
              <h3>Expert Technicians</h3>
              <p>Licensed and certified professionals</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Safe & Effective</h3>
              <p>Eco-friendly solutions for your family</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⏰</div>
              <h3>24/7 Service</h3>
              <p>Available when you need us most</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Affordable Prices</h3>
              <p>Competitive rates for quality service</p>
            </div>
          </div>
        </div>
      </section>

      <section className="services-preview">
        <div className="container">
          <h2>Our Services</h2>
          <div className="services-grid">
            <div className="service-card">
              <h3>Ant Control</h3>
              <p>Effective ant elimination and prevention</p>
            </div>
            <div className="service-card">
              <h3>Roach Control</h3>
              <p>Complete roach removal services</p>
            </div>
            <div className="service-card">
              <h3>Rodent Control</h3>
              <p>Safe rodent removal and prevention</p>
            </div>
            <div className="service-card">
              <h3>Termite Control</h3>
              <p>Professional termite treatment</p>
            </div>
          </div>
          <Link to="/services" className="btn-secondary">View All Services</Link>
        </div>
      </section>
    </div>
  )
}

export default Home

