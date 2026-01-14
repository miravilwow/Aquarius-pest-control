import { useState, useEffect, useRef } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Wrench, Calendar, Mail, ChevronDown, User, LogIn, UserPlus } from 'lucide-react'
import './ClientLayout.css'

function ClientLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false)
  const [contactDropdownOpen, setContactDropdownOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const userDropdownRef = useRef(null)
  const servicesDropdownRef = useRef(null)
  const contactDropdownRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setUserDropdownOpen(false)
    setServicesDropdownOpen(false)
    setContactDropdownOpen(false)
  }, [location])

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false)
      }
    }

    if (userDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [userDropdownOpen])

  // Close services dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (servicesDropdownRef.current && !servicesDropdownRef.current.contains(event.target)) {
        setServicesDropdownOpen(false)
      }
    }

    if (servicesDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [servicesDropdownOpen])

  // Close contact dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contactDropdownRef.current && !contactDropdownRef.current.contains(event.target)) {
        setContactDropdownOpen(false)
      }
    }

    if (contactDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [contactDropdownOpen])

  const serviceTypes = [
    { name: 'Services Overview', path: '/services', type: 'link' },
    { name: '---', type: 'separator' },
    { name: 'Book: Termite Control', pest: 'Dry Wood Termites', type: 'booking' },
    { name: 'Book: Cockroach Control', pest: 'Cockroach', type: 'booking' },
    { name: 'Book: Rodent Control', pest: 'Rodents', type: 'booking' },
    { name: 'Book: Bedbug Control', pest: 'Bedbugs', type: 'booking' },
    { name: 'Book: Ant Control', pest: 'Ants', type: 'booking' },
    { name: 'Book: Mosquito Control', pest: 'Mosquitoes', type: 'booking' },
    { name: 'Book: Ticks & Flea Control', pest: 'Ticks and Flea', type: 'booking' },
    { name: 'Book: Bukbok Control', pest: 'Bukbok', type: 'booking' },
  ]

  const contactItems = [
    { name: 'Contact Us', path: '/contact' },
    { name: 'About Us', path: '/about' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Our Location', path: '/location' },
    { name: 'Get Quote', path: '/booking' },
  ]

  const handleServiceSelect = (service) => {
    if (service.type === 'separator') return
    
    if (service.path) {
      navigate(service.path)
    } else if (service.pest) {
      navigate('/booking', { state: { selectedPest: service.pest } })
    }
    setServicesDropdownOpen(false)
    setMenuOpen(false)
  }

  const handleContactSelect = (item) => {
    navigate(item.path)
    setContactDropdownOpen(false)
    setMenuOpen(false)
  }


  return (
    <div className="client-layout-modern">
      <nav className={`navbar-modern ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="navbar-left">
            <Link to="/" className="logo-modern">
              <div className="logo-icon-modern">
                <img src="/image/logo.jpg" alt="Aquarius Pest Control Services" className="logo-img" />
              </div>
              <div className="logo-text">
                <h2>AQUARIUS PEST CONTROL SERVICES</h2>
              </div>
            </Link>
          </div>
          <div className="navbar-right">
            <ul className={`nav-menu-modern ${menuOpen ? 'active' : ''}`}>
              {/* Services Dropdown */}
              <li className="desktop-services-dropdown">
                <div className="services-dropdown-wrapper" ref={servicesDropdownRef}>
                  <button 
                    className={`services-dropdown-button ${servicesDropdownOpen ? 'active' : ''}`}
                    onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                  >
                    <Wrench size={18} />
                    <span>Services</span>
                    <ChevronDown 
                      size={16} 
                      className={`dropdown-chevron ${servicesDropdownOpen ? 'open' : ''}`} 
                    />
                  </button>
                  {servicesDropdownOpen && (
                    <div className="services-dropdown-content">
                      <div className="services-dropdown-list">
                        {serviceTypes.map((service, index) => {
                          if (service.type === 'separator') {
                            return <div key={`separator-${index}`} className="services-dropdown-separator" />
                          }
                          return (
                            <button
                              key={service.name}
                              className={`services-dropdown-item ${service.type === 'booking' ? 'booking-item' : ''}`}
                              onClick={() => handleServiceSelect(service)}
                            >
                              {service.name}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </li>
              {/* Contact Dropdown */}
              <li className="desktop-contact-dropdown">
                <div className="contact-dropdown-wrapper" ref={contactDropdownRef}>
                  <button 
                    className={`contact-dropdown-button ${contactDropdownOpen ? 'active' : ''}`}
                    onClick={() => setContactDropdownOpen(!contactDropdownOpen)}
                  >
                    <Mail size={18} />
                    <span>Contact</span>
                    <ChevronDown 
                      size={16} 
                      className={`dropdown-chevron ${contactDropdownOpen ? 'open' : ''}`} 
                    />
                  </button>
                  {contactDropdownOpen && (
                    <div className="contact-dropdown-content">
                      <div className="contact-dropdown-list">
                        {contactItems.map((item) => (
                          <button
                            key={item.name}
                            className="contact-dropdown-item"
                            onClick={() => handleContactSelect(item)}
                          >
                            {item.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </li>
              {/* Mobile Services Dropdown */}
              <li className="mobile-services-dropdown">
                <div className="services-dropdown-wrapper" ref={servicesDropdownRef}>
                  <button 
                    className={`services-dropdown-button mobile-services-button ${servicesDropdownOpen ? 'active' : ''}`}
                    onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                  >
                    <Wrench size={18} />
                    <span>Services</span>
                    <ChevronDown 
                      size={16} 
                      className={`dropdown-chevron ${servicesDropdownOpen ? 'open' : ''}`} 
                    />
                  </button>
                  {servicesDropdownOpen && (
                    <div className="services-dropdown-content mobile-dropdown-content">
                      <div className="services-dropdown-list">
                        {serviceTypes.map((service, index) => {
                          if (service.type === 'separator') {
                            return <div key={`separator-${index}`} className="services-dropdown-separator" />
                          }
                          return (
                            <button
                              key={service.name}
                              className={`services-dropdown-item ${service.type === 'booking' ? 'booking-item' : ''}`}
                              onClick={() => handleServiceSelect(service)}
                            >
                              {service.name}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </li>
              {/* Mobile Contact Dropdown */}
              <li className="mobile-contact-dropdown">
                <div className="contact-dropdown-wrapper" ref={contactDropdownRef}>
                  <button 
                    className={`contact-dropdown-button mobile-contact-button ${contactDropdownOpen ? 'active' : ''}`}
                    onClick={() => setContactDropdownOpen(!contactDropdownOpen)}
                  >
                    <Mail size={18} />
                    <span>Contact</span>
                    <ChevronDown 
                      size={16} 
                      className={`dropdown-chevron ${contactDropdownOpen ? 'open' : ''}`} 
                    />
                  </button>
                  {contactDropdownOpen && (
                    <div className="contact-dropdown-content mobile-dropdown-content">
                      <div className="contact-dropdown-list">
                        {contactItems.map((item) => (
                          <button
                            key={item.name}
                            className="contact-dropdown-item"
                            onClick={() => handleContactSelect(item)}
                          >
                            {item.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </li>
              {/* User Dropdown */}
              <li className="desktop-user-dropdown">
                <div className="user-dropdown-wrapper" ref={userDropdownRef}>
                  <button 
                    className={`user-dropdown-button ${userDropdownOpen ? 'active' : ''}`}
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  >
                    <User size={18} />
                    <span>Account</span>
                    <ChevronDown 
                      size={16} 
                      className={`dropdown-chevron ${userDropdownOpen ? 'open' : ''}`} 
                    />
                  </button>
                  {userDropdownOpen && (
                    <div className="user-dropdown-content">
                      <div className="user-dropdown-list">
                        <Link
                          to="/signin"
                          className="user-dropdown-item"
                          onClick={() => {
                            setUserDropdownOpen(false)
                            setMenuOpen(false)
                          }}
                        >
                          <LogIn size={16} />
                          <span>Sign In</span>
                        </Link>
                        <Link
                          to="/signup"
                          className="user-dropdown-item"
                          onClick={() => {
                            setUserDropdownOpen(false)
                            setMenuOpen(false)
                          }}
                        >
                          <UserPlus size={16} />
                          <span>Create Account</span>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </li>
              <li className="desktop-cta-item">
                <Link 
                  to="/booking" 
                  className="cta-button-modern"
                  onClick={() => setMenuOpen(false)}
                >
                  <Calendar size={18} />
                  <span>Book Now</span>
                </Link>
              </li>
              {/* Mobile User Dropdown */}
              <li className="mobile-user-dropdown">
                <div className="user-dropdown-wrapper" ref={userDropdownRef}>
                  <button 
                    className={`user-dropdown-button mobile-user-button ${userDropdownOpen ? 'active' : ''}`}
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  >
                    <User size={18} />
                    <span>Account</span>
                    <ChevronDown 
                      size={16} 
                      className={`dropdown-chevron ${userDropdownOpen ? 'open' : ''}`} 
                    />
                  </button>
                  {userDropdownOpen && (
                    <div className="user-dropdown-content mobile-dropdown-content">
                      <div className="user-dropdown-list">
                        <Link
                          to="/signin"
                          className="user-dropdown-item"
                          onClick={() => {
                            setUserDropdownOpen(false)
                            setMenuOpen(false)
                          }}
                        >
                          <LogIn size={16} />
                          <span>Sign In</span>
                        </Link>
                        <Link
                          to="/signup"
                          className="user-dropdown-item"
                          onClick={() => {
                            setUserDropdownOpen(false)
                            setMenuOpen(false)
                          }}
                        >
                          <UserPlus size={16} />
                          <span>Create Account</span>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </li>
              <li className="mobile-cta-item">
                <Link 
                  to="/booking" 
                  className="cta-button-modern mobile-cta"
                  onClick={() => setMenuOpen(false)}
                >
                  <Calendar size={18} />
                  <span>Book Now</span>
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
                <img src="/image/logo.jpg" alt="Aquarius Pest Control Services" className="footer-logo-img" />
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

