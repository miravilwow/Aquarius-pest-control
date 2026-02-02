import React, { useState, useEffect, useMemo, useCallback, memo } from 'react'
import axios from 'axios'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  Wrench,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react'
import './AdminDashboard.css'

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    totalCustomers: 0,
    totalServices: 0
  })
  const [previousStats, setPreviousStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    totalCustomers: 0,
    totalServices: 0
  })
  const [bookingsRaw, setBookingsRaw] = useState([])
  const [recentBookings, setRecentBookings] = useState([])
  const [chartData, setChartData] = useState({
    bookingsByStatus: [],
    bookingsByService: [],
    bookingsByMonth: []
  })
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)
  const [timeRange, setTimeRange] = useState('90d')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateRange, setDateRange] = useState()

  /**
   * Prepare chart data from bookings array
   * @param {Array} bookings - Array of booking objects
   * @returns {void} Sets chartData state
   */
  const prepareChartData = useCallback((bookings) => {
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
  }, [])

  /**
   * Fetch dashboard data (bookings, customers, services)
   * @async
   * @returns {Promise<void>}
   */
  const fetchDashboardData = useCallback(async () => {
    setFetchError(null)
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

      // Calculate previous period stats (last 30 days vs previous 30 days)
      const now = new Date()
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

      const currentPeriodBookings = bookings.filter(b => {
        const bookingDate = new Date(b.created_at || b.preferred_date)
        return bookingDate >= thirtyDaysAgo
      })

      const previousPeriodBookings = bookings.filter(b => {
        const bookingDate = new Date(b.created_at || b.preferred_date)
        return bookingDate >= sixtyDaysAgo && bookingDate < thirtyDaysAgo
      })

      const currentPeriodCustomers = customersRes.data.filter(c => {
        const customerDate = new Date(c.created_at || c.registered_at || Date.now())
        return customerDate >= thirtyDaysAgo
      })

      const previousPeriodCustomers = customersRes.data.filter(c => {
        const customerDate = new Date(c.created_at || c.registered_at || Date.now())
        return customerDate >= sixtyDaysAgo && customerDate < thirtyDaysAgo
      })

      // Store previous stats for trend calculation
      setPreviousStats({
        totalBookings: previousPeriodBookings.length,
        pendingBookings: previousPeriodBookings.filter(b => b.status === 'pending').length,
        totalCustomers: previousPeriodCustomers.length,
        totalServices: servicesRes.data.length // Services don't change frequently
      })

      setBookingsRaw(bookings)

      setStats({
        totalBookings: bookings.length,
        pendingBookings: pending,
        totalCustomers: customersRes.data.length,
        totalServices: servicesRes.data.length
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      const detail = error.response?.data?.detail || error.response?.data?.message || error.message
      setFetchError(detail || 'Failed to load dashboard data.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  const COLORS = ['#3498db', '#e74c3c', '#27ae60', '#f39c12', '#9b59b6']

  // Calculate trend percentage
  const calculateTrend = (current, previous) => {
    if (previous === 0) {
      return current > 0 ? { percentage: 100, isPositive: true } : { percentage: 0, isPositive: false }
    }
    const percentage = ((current - previous) / previous) * 100
    return {
      percentage: Math.abs(percentage).toFixed(1),
      isPositive: percentage >= 0
    }
  }

  // Get trend indicators for each stat
  const bookingTrend = calculateTrend(stats.totalBookings, previousStats.totalBookings)
  const pendingTrend = calculateTrend(stats.pendingBookings, previousStats.pendingBookings)
  const customerTrend = calculateTrend(stats.totalCustomers, previousStats.totalCustomers)
  const serviceTrend = calculateTrend(stats.totalServices, previousStats.totalServices)

  // Interactive Area Chart (shadcn + recharts demo)
  const interactiveChartData = [
    { date: '2024-04-01', desktop: 222, mobile: 150 },
    { date: '2024-04-02', desktop: 97, mobile: 180 },
    { date: '2024-04-03', desktop: 167, mobile: 120 },
    { date: '2024-04-04', desktop: 242, mobile: 260 },
    { date: '2024-04-05', desktop: 373, mobile: 290 },
    { date: '2024-04-06', desktop: 301, mobile: 340 },
    { date: '2024-04-07', desktop: 245, mobile: 180 },
    { date: '2024-04-08', desktop: 409, mobile: 320 },
    { date: '2024-04-09', desktop: 59, mobile: 110 },
    { date: '2024-04-10', desktop: 261, mobile: 190 },
    { date: '2024-04-11', desktop: 327, mobile: 350 },
    { date: '2024-04-12', desktop: 292, mobile: 210 },
    { date: '2024-04-13', desktop: 342, mobile: 380 },
    { date: '2024-04-14', desktop: 137, mobile: 220 },
    { date: '2024-04-15', desktop: 120, mobile: 170 },
    { date: '2024-04-16', desktop: 138, mobile: 190 },
    { date: '2024-04-17', desktop: 446, mobile: 360 },
    { date: '2024-04-18', desktop: 364, mobile: 410 },
    { date: '2024-04-19', desktop: 243, mobile: 180 },
    { date: '2024-04-20', desktop: 89, mobile: 150 },
    { date: '2024-04-21', desktop: 137, mobile: 200 },
    { date: '2024-04-22', desktop: 224, mobile: 170 },
    { date: '2024-04-23', desktop: 138, mobile: 230 },
    { date: '2024-04-24', desktop: 387, mobile: 290 },
    { date: '2024-04-25', desktop: 215, mobile: 250 },
    { date: '2024-04-26', desktop: 75, mobile: 130 },
    { date: '2024-04-27', desktop: 383, mobile: 420 },
    { date: '2024-04-28', desktop: 122, mobile: 180 },
    { date: '2024-04-29', desktop: 315, mobile: 240 },
    { date: '2024-04-30', desktop: 454, mobile: 380 },
    { date: '2024-05-01', desktop: 165, mobile: 220 },
    { date: '2024-05-02', desktop: 293, mobile: 310 },
    { date: '2024-05-03', desktop: 247, mobile: 190 },
    { date: '2024-05-04', desktop: 385, mobile: 420 },
    { date: '2024-05-05', desktop: 481, mobile: 390 },
    { date: '2024-05-06', desktop: 498, mobile: 520 },
    { date: '2024-05-07', desktop: 388, mobile: 300 },
    { date: '2024-05-08', desktop: 149, mobile: 210 },
    { date: '2024-05-09', desktop: 227, mobile: 180 },
    { date: '2024-05-10', desktop: 293, mobile: 330 },
    { date: '2024-05-11', desktop: 335, mobile: 270 },
    { date: '2024-05-12', desktop: 197, mobile: 240 },
    { date: '2024-05-13', desktop: 197, mobile: 160 },
    { date: '2024-05-14', desktop: 448, mobile: 490 },
    { date: '2024-05-15', desktop: 473, mobile: 380 },
    { date: '2024-05-16', desktop: 338, mobile: 400 },
    { date: '2024-05-17', desktop: 499, mobile: 420 },
    { date: '2024-05-18', desktop: 315, mobile: 350 },
    { date: '2024-05-19', desktop: 235, mobile: 180 },
    { date: '2024-05-20', desktop: 177, mobile: 230 },
    { date: '2024-05-21', desktop: 82, mobile: 140 },
    { date: '2024-05-22', desktop: 81, mobile: 120 },
    { date: '2024-05-23', desktop: 252, mobile: 290 },
    { date: '2024-05-24', desktop: 294, mobile: 220 },
    { date: '2024-05-25', desktop: 201, mobile: 250 },
    { date: '2024-05-26', desktop: 213, mobile: 170 },
    { date: '2024-05-27', desktop: 420, mobile: 460 },
    { date: '2024-05-28', desktop: 233, mobile: 190 },
    { date: '2024-05-29', desktop: 78, mobile: 130 },
    { date: '2024-05-30', desktop: 340, mobile: 280 },
    { date: '2024-05-31', desktop: 178, mobile: 230 },
    { date: '2024-06-01', desktop: 178, mobile: 200 },
    { date: '2024-06-02', desktop: 470, mobile: 410 },
    { date: '2024-06-03', desktop: 103, mobile: 160 },
    { date: '2024-06-04', desktop: 439, mobile: 380 },
    { date: '2024-06-05', desktop: 88, mobile: 140 },
    { date: '2024-06-06', desktop: 294, mobile: 250 },
    { date: '2024-06-07', desktop: 323, mobile: 370 },
    { date: '2024-06-08', desktop: 385, mobile: 320 },
    { date: '2024-06-09', desktop: 438, mobile: 480 },
    { date: '2024-06-10', desktop: 155, mobile: 200 },
    { date: '2024-06-11', desktop: 92, mobile: 150 },
    { date: '2024-06-12', desktop: 492, mobile: 420 },
    { date: '2024-06-13', desktop: 81, mobile: 130 },
    { date: '2024-06-14', desktop: 426, mobile: 380 },
    { date: '2024-06-15', desktop: 307, mobile: 350 },
    { date: '2024-06-16', desktop: 371, mobile: 310 },
    { date: '2024-06-17', desktop: 475, mobile: 520 },
    { date: '2024-06-18', desktop: 107, mobile: 170 },
    { date: '2024-06-19', desktop: 341, mobile: 290 },
    { date: '2024-06-20', desktop: 408, mobile: 450 },
    { date: '2024-06-21', desktop: 169, mobile: 210 },
    { date: '2024-06-22', desktop: 317, mobile: 270 },
    { date: '2024-06-23', desktop: 480, mobile: 530 },
    { date: '2024-06-24', desktop: 132, mobile: 180 },
    { date: '2024-06-25', desktop: 141, mobile: 190 },
    { date: '2024-06-26', desktop: 434, mobile: 380 },
    { date: '2024-06-27', desktop: 448, mobile: 490 },
    { date: '2024-06-28', desktop: 149, mobile: 200 },
    { date: '2024-06-29', desktop: 103, mobile: 160 },
    { date: '2024-06-30', desktop: 446, mobile: 400 },
  ]

  const interactiveChartConfig = {
    desktop: { label: 'Desktop', color: '#3498db' },
    mobile: { label: 'Mobile', color: '#e74c3c' },
  }

  // Memoize filtered bookings to avoid recalculating on every render
  const filteredBookingsForCharts = useMemo(() => {
    if (!bookingsRaw || bookingsRaw.length === 0) {
      return []
    }

    let filtered =
      statusFilter === 'all'
        ? bookingsRaw
        : bookingsRaw.filter((b) => b.status === statusFilter)

    if (dateRange?.from) {
      const from = new Date(
        dateRange.from.getFullYear(),
        dateRange.from.getMonth(),
        dateRange.from.getDate(),
        0,
        0,
        0,
        0
      )
      const toSource = dateRange.to ?? dateRange.from
      const to = new Date(
        toSource.getFullYear(),
        toSource.getMonth(),
        toSource.getDate(),
        23,
        59,
        59,
        999
      )
      filtered = filtered.filter((b) => {
        const raw = b.preferred_date || b.created_at
        if (!raw) return false
        const d = new Date(raw)
        return d >= from && d <= to
      })
    }

    return filtered
  }, [bookingsRaw, statusFilter, dateRange])

  useEffect(() => {
    if (filteredBookingsForCharts.length === 0) {
      setChartData({
        bookingsByStatus: [],
        bookingsByService: [],
        bookingsByMonth: []
      })
      setRecentBookings([])
      return
    }

    prepareChartData(filteredBookingsForCharts)
    setRecentBookings(filteredBookingsForCharts.slice(0, 5))
  }, [filteredBookingsForCharts, prepareChartData])

  if (loading) {
    return (
      <div className="admin-dashboard">
        <h1>Dashboard</h1>
        <div className="stats-grid">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="stat-card-enhanced">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="charts-section">
          <div className="chart-container">
            <Skeleton className="h-[300px] w-full rounded-lg" />
          </div>
          <div className="chart-container">
            <Skeleton className="h-[300px] w-full rounded-lg" />
          </div>
          <div className="chart-container">
            <Skeleton className="h-[300px] w-full rounded-lg" />
          </div>
        </div>
        <div className="recent-bookings">
          <h2>Recent Bookings</h2>
          <Skeleton className="h-40 w-full rounded-lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard" role="main" aria-label="Admin Dashboard">
      <a href="#dashboard-content" className="skip-to-main">Skip to main content</a>
      {/* ARIA live region for dynamic updates */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {loading ? 'Loading dashboard data...' : `Dashboard loaded. ${stats.totalBookings} total bookings, ${stats.totalCustomers} customers`}
      </div>
      <div className="dashboard-header-row">
        <h1 id="dashboard-title">Dashboard</h1>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              aria-label="Open filters"
              aria-expanded={false}
              aria-haspopup="true"
            >
              Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-auto">
            <div className="dashboard-filter-content">
              <p className="dashboard-filter-title">Quick Filters</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Button
                  variant={timeRange === '7d' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange('7d')}
                >
                  Last 7 Days
                </Button>
                <Button
                  variant={timeRange === '30d' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange('30d')}
                >
                  Last 30 Days
                </Button>
                <Button
                  variant={timeRange === '90d' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange('90d')}
                >
                  Last 3 Months
                </Button>
              </div>
              <p className="dashboard-filter-title" style={{ marginTop: '1rem' }}>Time range</p>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger
                  className="w-full rounded-lg mt-2"
                  aria-label="Select time range"
                >
                  <SelectValue placeholder="Last 3 months" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="90d" className="rounded-lg">
                    Last 3 months
                  </SelectItem>
                  <SelectItem value="30d" className="rounded-lg">
                    Last 30 days
                  </SelectItem>
                  <SelectItem value="7d" className="rounded-lg">
                    Last 7 days
                  </SelectItem>
                </SelectContent>
              </Select>

              <p className="dashboard-filter-title" style={{ marginTop: '1rem' }}>
                Status
              </p>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger
                  className="w-full rounded-lg mt-2"
                  aria-label="Select status"
                >
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all" className="rounded-lg">
                    All
                  </SelectItem>
                  <SelectItem value="pending" className="rounded-lg">
                    Pending
                  </SelectItem>
                  <SelectItem value="confirmed" className="rounded-lg">
                    Confirmed
                  </SelectItem>
                  <SelectItem value="completed" className="rounded-lg">
                    Completed
                  </SelectItem>
                  <SelectItem value="cancelled" className="rounded-lg">
                    Cancelled
                  </SelectItem>
                </SelectContent>
              </Select>

              <p className="dashboard-filter-title" style={{ marginTop: '1rem' }}>
                Date range
              </p>
              <div className="dashboard-filter-calendar">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={1}
                  className="rounded-lg border"
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      {fetchError && (
        <div className="dashboard-error" role="alert">
          <strong>Error loading data:</strong> {fetchError}
          <br />
          <span className="dashboard-error-hint">Run: node server/database/setup-tables.js (from project root). Ensure the pest_control database exists.</span>
        </div>
      )}
      <div className="stats-grid">
        <Card
          className="stat-card-enhanced stat-card-bookings"
          onClick={() => {
            setStatusFilter('all')
            setDateRange(undefined)
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <div className="flex items-center gap-1 mt-1">
              {bookingTrend.percentage > 0 && (
                <>
                  {bookingTrend.isPositive ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <p className={`text-xs font-medium ${bookingTrend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {bookingTrend.percentage}% {bookingTrend.isPositive ? 'increase' : 'decrease'}
                  </p>
                </>
              )}
              {bookingTrend.percentage === 0 && (
                <p className="text-xs text-muted-foreground">No change</p>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              All time bookings
            </p>
          </CardContent>
        </Card>

        <Card
          className="stat-card-enhanced stat-card-pending"
          onClick={() => {
            setStatusFilter('pending')
            setDateRange(undefined)
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pendingBookings}</div>
            <div className="flex items-center gap-1 mt-1">
              {pendingTrend.percentage > 0 && (
                <>
                  {pendingTrend.isPositive ? (
                    <TrendingUp className="h-3 w-3 text-red-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-green-600" />
                  )}
                  <p className={`text-xs font-medium ${pendingTrend.isPositive ? 'text-red-600' : 'text-green-600'}`}>
                    {pendingTrend.percentage}% {pendingTrend.isPositive ? 'increase' : 'decrease'}
                  </p>
                </>
              )}
              {pendingTrend.percentage === 0 && (
                <p className="text-xs text-muted-foreground">No change</p>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Requires attention
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card-enhanced stat-card-customers">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <div className="flex items-center gap-1 mt-1">
              {customerTrend.percentage > 0 && (
                <>
                  {customerTrend.isPositive ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <p className={`text-xs font-medium ${customerTrend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {customerTrend.percentage}% {customerTrend.isPositive ? 'increase' : 'decrease'}
                  </p>
                </>
              )}
              {customerTrend.percentage === 0 && (
                <p className="text-xs text-muted-foreground">No change</p>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Registered customers
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card-enhanced stat-card-services">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Services</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalServices}</div>
            <div className="flex items-center gap-1 mt-1">
              {serviceTrend.percentage > 0 && (
                <>
                  {serviceTrend.isPositive ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <p className={`text-xs font-medium ${serviceTrend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {serviceTrend.percentage}% {serviceTrend.isPositive ? 'increase' : 'decrease'}
                  </p>
                </>
              )}
              {serviceTrend.percentage === 0 && (
                <p className="text-xs text-muted-foreground">No change</p>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Available services
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-container">
          <h2>Bookings by Status</h2>
          {chartData.bookingsByStatus.length > 0 ? (
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
          ) : (
            <div className="chart-empty-state">
              <PieChartIcon className="empty-state-icon" />
              <p className="empty-state-text">No booking data available</p>
              <p className="empty-state-subtext">Charts will appear once bookings are created</p>
            </div>
          )}
        </div>

        <div className="chart-container">
          <h2>Bookings by Service</h2>
          {chartData.bookingsByService.length > 0 ? (
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
          ) : (
            <div className="chart-empty-state">
              <BarChart3 className="empty-state-icon" />
              <p className="empty-state-text">No service data available</p>
              <p className="empty-state-subtext">Charts will appear once bookings are created</p>
            </div>
          )}
        </div>

        <div className="chart-container">
          <ChartAreaInteractive
            data={interactiveChartData}
            config={interactiveChartConfig}
            timeRange={timeRange}
          />
        </div>
      </div>

      <div className="recent-bookings">
        <h2>Recent Bookings</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentBookings.length > 0 ? (
              recentBookings.map(booking => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.name}</TableCell>
                  <TableCell>{booking.service_name || 'N/A'}</TableCell>
                  <TableCell>{new Date(booking.preferred_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={
                      booking.status === 'pending' ? 'secondary' :
                        booking.status === 'confirmed' ? 'default' :
                          booking.status === 'completed' ? 'default' :
                            booking.status === 'cancelled' ? 'destructive' : 'outline'
                    }>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12">
                  <div className="empty-state">
                    <CalendarIcon className="empty-state-icon" />
                    <h3 className="empty-state-title">No bookings yet</h3>
                    <p className="empty-state-description">
                      Recent bookings will appear here once customers start making reservations.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

/**
 * Interactive Area Chart Component
 * Displays booking trends over time with filtering
 * @param {Object} props - Component props
 * @param {Array} props.data - Chart data array
 * @param {Object} props.config - Chart configuration (colors, labels)
 * @param {string} props.timeRange - Time range filter (7d, 30d, 90d)
 * @returns {JSX.Element} Area chart component
 */
const ChartAreaInteractive = memo(function ChartAreaInteractive({ data, config, timeRange }) {
  const filteredData = data.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date('2024-06-30')
    let daysToSubtract = 90
    if (timeRange === '30d') {
      daysToSubtract = 30
    } else if (timeRange === '7d') {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="pt-0 border-none shadow-none">
      <CardHeader className="flex items-center gap-2 space-y-0 px-0 pb-4 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Area Chart - Interactive</CardTitle>
          <CardDescription>
            Showing total visitors for the selected period
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-0 pt-0">
        <div className="w-full" style={{ minHeight: 250 }}>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={config?.desktop?.color || '#3498db'} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={config?.desktop?.color || '#3498db'} stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={config?.mobile?.color || '#e74c3c'} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={config?.mobile?.color || '#e74c3c'} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                }
              />
              <Tooltip
                labelFormatter={(value) =>
                  new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                }
              />
              <Area dataKey="mobile" type="natural" fill="url(#fillMobile)" stroke={config?.mobile?.color || '#e74c3c'} stackId="a" />
              <Area dataKey="desktop" type="natural" fill="url(#fillDesktop)" stroke={config?.desktop?.color || '#3498db'} stackId="a" />
              <Legend />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
})

ChartAreaInteractive.displayName = 'ChartAreaInteractive'

export default AdminDashboard

