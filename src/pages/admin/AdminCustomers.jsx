import { useState, useEffect } from 'react'
import axios from 'axios'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import './AdminCustomers.css'

function AdminCustomers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const pageSize = 10

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await axios.get('http://localhost:5000/api/admin/customers', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCustomers(response.data)
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="admin-customers">
        <h1>Customers</h1>
        <div className="customers-table-container">
          <Skeleton className="h-6 w-40 mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  const totalPages = Math.ceil(customers.length / pageSize) || 1
  const start = (page - 1) * pageSize
  const visible = customers.slice(start, start + pageSize)

  const goTo = (p) => {
    if (p < 1 || p > totalPages) return
    setPage(p)
  }

  return (
    <div className="admin-customers">
      <h1>Customers</h1>
      <div className="customers-table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Total Bookings</th>
            </tr>
          </thead>
          <tbody>
            {visible.length > 0 ? (
              visible.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.id}</td>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.address || 'N/A'}</td>
                  <td>{customer.total_bookings || 0}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>No customers found</td>
              </tr>
            )}
          </tbody>
        </table>
        {customers.length > pageSize && (
          <div className="customers-pagination">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => goTo(page - 1)}
                    href="#"
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const p = idx + 1
                  return (
                    <PaginationItem key={p}>
                      <PaginationLink
                        href="#"
                        isActive={p === page}
                        onClick={() => goTo(p)}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  )
                })}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => goTo(page + 1)}
                    href="#"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminCustomers

