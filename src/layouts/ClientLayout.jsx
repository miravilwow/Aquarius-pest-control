import { useState, useEffect } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Building2, Menu, X, Wrench, Calendar, Mail, Shield } from 'lucide-react'
import './ClientLayout.css'

function ClientLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  const navItems = [
    { path: '/services', label: 'Services', icon: Wrench },
    { path: '/contact', label: 'Contact', icon: Mail },
  ]

  return (
    <div className="client-layout-modern">
      <nav className={`navbar-modern ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="navbar-left">
            <Link to="/" className="logo-modern">
              <div className="logo-icon-modern">
                <Building2 size={32} />
              </div>
              <div className="logo-text">
                <h2>Aquarius Pest Control</h2>
                <span className="logo-subtitle">Services</span>
              </div>
            </Link>
          </div>
          <div className="navbar-right">
            <ul className={`nav-menu-modern ${menuOpen ? 'active' : ''}`}>
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <li key={item.path}>
                    <Link 
                      to={item.path} 
                      onClick={() => setMenuOpen(false)}
                      className={isActive ? 'active' : ''}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                )
              })}
              <li>
                <Link 
                  to="/booking" 
                  className="cta-button-modern"
                  onClick={() => setMenuOpen(false)}
                >
                  <Calendar size={18} />
                  <span>Book Now</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin/login" 
                  className="admin-link-modern"
                  onClick={() => setMenuOpen(false)}
                >
                  <Shield size={18} />
                  <span>Admin</span>
                </Link>
              </li>
            </ul>
            <button 
              className={`menu-toggle-modern ${menuOpen ? 'active' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>
      <main className="main-modern">
        <Outlet />
      </main>
      <footer className="footer-modern">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <Building2 size={32} />
                <h3>Aquarius Pest Control Services</h3>
              </div>
              <p className="footer-description">
                Professional, Legitimate, and Trusted Pest Control for 18 Years
              </p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/services">Services</Link></li>
                <li><Link to="/booking">Book Now</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact Info</h4>
              <ul>
                <li>📱 09265557359</li>
                <li>✉️ rodolfomiravil65@gmail.com</li>
                <li>📍 Bulacan Branch</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Aquarius Pest Control Services. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default ClientLayout

