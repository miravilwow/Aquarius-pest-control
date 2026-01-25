import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import ClientLayout from './layouts/ClientLayout'
import AdminLayout from './layouts/AdminLayout'
import Home from './pages/client/Home'
import Services from './pages/client/Services'
import Booking from './pages/client/Booking'
import Contact from './pages/client/Contact'
import AdminLogin from './pages/admin/AdminLogin'
import { AuthProvider, useAuth } from './context/AuthContext'
import { Toaster } from '@/components/ui/sonner'
import { Skeleton } from '@/components/ui/skeleton'
import './App.css'

// Lazy load admin pages for better performance
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminBookings = lazy(() => import('./pages/admin/AdminBookings'))
const AdminServices = lazy(() => import('./pages/admin/AdminServices'))
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers'))
const AdminActivityLog = lazy(() => import('./pages/admin/AdminActivityLog'))

// Loading component for lazy loaded pages
function PageLoader() {
  return (
    <div className="min-h-screen p-6 space-y-6" role="status" aria-label="Loading page">
      <Skeleton className="h-10 w-64" />
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  )
}

// Page transition wrapper
function PageTransition({ children }) {
  const location = useLocation()
  
  return (
    <div
      key={location.pathname}
      className="page-transition"
      style={{
        animation: 'fadeIn 0.3s ease-in-out'
      }}
    >
      {children}
    </div>
  )
}

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
            <Route 
              index 
              element={
                <Suspense fallback={<PageLoader />}>
                  <PageTransition>
                    <AdminDashboard />
                  </PageTransition>
                </Suspense>
              } 
            />
            <Route 
              path="bookings" 
              element={
                <Suspense fallback={<PageLoader />}>
                  <PageTransition>
                    <AdminBookings />
                  </PageTransition>
                </Suspense>
              } 
            />
            <Route 
              path="services" 
              element={
                <Suspense fallback={<PageLoader />}>
                  <PageTransition>
                    <AdminServices />
                  </PageTransition>
                </Suspense>
              } 
            />
            <Route 
              path="customers" 
              element={
                <Suspense fallback={<PageLoader />}>
                  <PageTransition>
                    <AdminCustomers />
                  </PageTransition>
                </Suspense>
              } 
            />
            <Route 
              path="activity-log" 
              element={
                <Suspense fallback={<PageLoader />}>
                  <PageTransition>
                    <AdminActivityLog />
                  </PageTransition>
                </Suspense>
              } 
            />
          </Route>
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  )
}

export default App
