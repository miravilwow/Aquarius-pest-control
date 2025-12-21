import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import './AdminDashboard.css'

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    totalCustomers: 0,
    totalServices: 0
  })
  const [recentBookings, setRecentBookings] = useState([])
  const [chartData, setChartData] = useState({
    bookingsByStatus: [],
    bookingsByService: [],
    bookingsByMonth: []
  })
  const [loading, setLoading] = useState(true)

  const prepareChartData = (bookings, services) => {
    // Bookings by Status (Pie Chart)
    const statusCount = {}
    bookings.forEach(booking => {
      statusCount[booking.status] = (statusCount[booking.status] || 0) + 1
    })
    const bookingsByStatus = Object.keys(statusCount).map(status => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: statusCount[status]
    }))

    // Bookings by Service (Bar Chart)
    const serviceCount = {}
    bookings.forEach(booking => {
      const serviceName = booking.service_name || 'Unknown'
      serviceCount[serviceName] = (serviceCount[serviceName] || 0) + 1
    })
    const bookingsByService = Object.keys(serviceCount).map(service => ({
      name: service,
      bookings: serviceCount[service]
    }))

    // Bookings by Month (Line Chart)
    const monthCount = {}
    bookings.forEach(booking => {
      const date = new Date(booking.created_at || booking.preferred_date)
      const month = date.toLocaleDateString('en-US', { month: 'short' })
      monthCount[month] = (monthCount[month] || 0) + 1
    })
    const bookingsByMonth = Object.keys(monthCount)
      .sort((a, b) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        return months.indexOf(a) - months.indexOf(b)
      })
      .map(month => ({
        month,
        bookings: monthCount[month]
      }))

    setChartData({
      bookingsByStatus,
      bookingsByService,
      bookingsByMonth
    })
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const [bookingsRes, customersRes, servicesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/bookings', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/admin/customers', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/services')
      ])

      const bookings = bookingsRes.data
      const pending = bookings.filter(b => b.status === 'pending').length

      setStats({
        totalBookings: bookings.length,
        pendingBookings: pending,
        totalCustomers: customersRes.data.length,
        totalServices: servicesRes.data.length
      })

      setRecentBookings(bookings.slice(0, 5))

      // Prepare chart data
      prepareChartData(bookings, servicesRes.data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const COLORS = ['#3498db', '#e74c3c', '#27ae60', '#f39c12', '#9b59b6']

  if (loading) {
    return <div className="loading">Loading dashboard...</div>
  }

  return (
    <div className="admin-dashboard">
      <h1>Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Bookings</h3>
          <p className="stat-number">{stats.totalBookings}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Bookings</h3>
          <p className="stat-number warning">{stats.pendingBookings}</p>
        </div>
        <div className="stat-card">
          <h3>Total Customers</h3>
          <p className="stat-number">{stats.totalCustomers}</p>
        </div>
        <div className="stat-card">
          <h3>Services</h3>
          <p className="stat-number">{stats.totalServices}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-container">
          <h2>Bookings by Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.bookingsByStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.bookingsByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h2>Bookings by Service</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.bookingsByService}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="bookings" fill="#3498db" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h2>Bookings Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.bookingsByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="bookings" stroke="#e74c3c" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="recent-bookings">
        <h2>Recent Bookings</h2>
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Service</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentBookings.length > 0 ? (
              recentBookings.map(booking => (
                <tr key={booking.id}>
                  <td>{booking.name}</td>
                  <td>{booking.service_name || 'N/A'}</td>
                  <td>{new Date(booking.preferred_date).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${booking.status}`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>No bookings yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminDashboard

