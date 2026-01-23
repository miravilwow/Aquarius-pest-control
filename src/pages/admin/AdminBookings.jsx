import { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Trash2, CheckCircle2, XCircle } from 'lucide-react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import './AdminBookings.css'

function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await axios.get('http://localhost:5000/api/admin/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setBookings(response.data)
      setCurrentPage(1)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken')
      await axios.put(
        `http://localhost:5000/api/admin/bookings/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchBookings()
    } catch (error) {
      console.error('Error updating booking:', error)
      alert('Error updating booking status')
    }
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === bookings.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(bookings.map((b) => b.id))
    }
  }

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const bulkUpdateStatus = async (newStatus) => {
    if (selectedIds.length === 0) return
    try {
      const token = localStorage.getItem('adminToken')
      await Promise.all(
        selectedIds.map((id) =>
          axios.put(
            `http://localhost:5000/api/admin/bookings/${id}`,
            { status: newStatus },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        )
      )
      setSelectedIds([])
      fetchBookings()
    } catch (error) {
      console.error('Error updating selected bookings:', error)
      alert('Error updating selected bookings')
    }
  }

  if (loading) {
    return (
      <div className="admin-bookings">
        <h1>Bookings Management</h1>
        <div className="bookings-table-container">
          <Skeleton className="h-6 w-40 mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  const totalPages = Math.max(1, Math.ceil(bookings.length / pageSize))
  const startIndex = (currentPage - 1) * pageSize
  const paginatedBookings = bookings.slice(startIndex, startIndex + pageSize)

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  return (
    <div className="admin-bookings">
      <h1>Bookings Management</h1>
      <div className="bookings-table-container">
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={bookings.length > 0 && selectedIds.length === bookings.length}
                  onChange={toggleSelectAll}
                />
              </th>
              <th>ID</th>
              <th>Customer</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Service</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedBookings.length > 0 ? (
              paginatedBookings.map(booking => (
                <tr key={booking.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(booking.id)}
                      onChange={() => toggleSelectOne(booking.id)}
                    />
                  </td>
                  <td>{booking.id}</td>
                  <td>{booking.name}</td>
                  <td>{booking.email}</td>
                  <td>{booking.phone}</td>
                  <td>{booking.service_name || 'N/A'}</td>
                  <td>{new Date(booking.preferred_date).toLocaleDateString()}</td>
                  <td>{booking.preferred_time}</td>
                  <td>
                    <span className={`status-badge ${booking.status}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    <select
                      value={booking.status}
                      onChange={(e) => updateStatus(booking.id, e.target.value)}
                      className="status-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center' }}>No bookings found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="bookings-pagination">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    goToPage(currentPage - 1)
                  }}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, index) => {
                const page = index + 1
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      isActive={page === currentPage}
                      onClick={(e) => {
                        e.preventDefault()
                        goToPage(page)
                      }}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              })}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    goToPage(currentPage - 1 + 2) // currentPage + 1
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
      {selectedIds.length > 0 && (
        <div className="bookings-action-bar">
          <div className="bookings-action-bar-info">
            <span>{selectedIds.length} selected</span>
          </div>
          <div className="bookings-action-bar-actions">
            <Button
              variant="outline"
              size="sm"
              onClick={() => bulkUpdateStatus('completed')}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Mark Completed
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => bulkUpdateStatus('cancelled')}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Mark Cancelled
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedIds([])}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Selection
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminBookings

