import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ClientLayout from './layouts/ClientLayout'
import AdminLayout from './layouts/AdminLayout'
import Home from './pages/client/Home'
import Services from './pages/client/Services'
import Booking from './pages/client/Booking'
import Contact from './pages/client/Contact'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminBookings from './pages/admin/AdminBookings'
import AdminServices from './pages/admin/AdminServices'
import AdminCustomers from './pages/admin/AdminCustomers'
import { AuthProvider, useAuth } from './context/AuthContext'
import './App.css'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/admin/login" />
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Client Routes */}
          <Route path="/" element={<ClientLayout />}>
            <Route index element={<Home />} />
            <Route path="services" element={<Services />} />
            <Route path="booking" element={<Booking />} />
            <Route path="contact" element={<Contact />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="customers" element={<AdminCustomers />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
