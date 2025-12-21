import { useState } from 'react'
import { Outlet, Link } from 'react-router-dom'
import './ClientLayout.css'

function ClientLayout() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="client-layout">
      <nav className="navbar">
        <div className="container">
          <Link to="/" className="logo">
            <img 
              src="https://scontent.fcrk1-2.fna.fbcdn.net/v/t39.30808-6/247517119_1040926690025783_3271896171650896471_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHqLT6Uvu1Sb4miuoT5evBDMK8cwDXLlT0wrxzANcuVPZQdasrVqaYWuL7pYsR2kK7oFpkhNnDfJjrKCVub_6QC&_nc_ohc=A7lOd25oVqgQ7kNvwGb-UVN&_nc_oc=AdlRYWfhADgPw8Fua-ezqUd4VugSjCCZoh7utbWex4t2jFcWekIGmywj9N89zexggJ0&_nc_zt=23&_nc_ht=scontent.fcrk1-2.fna&_nc_gid=thNKrsOKoV7VM-ptWgDBrg&oh=00_AfluMfHgJGV_F_py790i8kvV0hZGohjjy-gzO-WkXJoRxg&oe=694D5642" 
              alt="Aquarius Pest Control Services Logo" 
              className="logo-img"
            />
            <h2>Aquarius Pest Control Services</h2>
          </Link>
          <button 
            className="menu-toggle" 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
          <ul className={`nav-menu ${menuOpen ? 'active' : ''}`}>
            <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
            <li><Link to="/services" onClick={() => setMenuOpen(false)}>Services</Link></li>
            <li><Link to="/booking" onClick={() => setMenuOpen(false)}>Book Now</Link></li>
            <li><Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link></li>
            <li><Link to="/admin/login" className="admin-link" onClick={() => setMenuOpen(false)}>Admin</Link></li>
          </ul>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 Aquarius Pest Control Services. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default ClientLayout

