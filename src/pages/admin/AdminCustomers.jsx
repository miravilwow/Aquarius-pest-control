import { useState, useEffect, useMemo, useCallback, useRef, memo } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { logActivity, ActivityType } from '@/utils/activityLog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Users, Download, Search } from 'lucide-react'
import debounce from 'lodash.debounce'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ArrowUpDown, ChevronDown } from 'lucide-react'
import { cn } from '@/utils/index'
import './AdminCustomers.css'

const columnHelper = createColumnHelper()

function AdminCustomers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [sorting, setSorting] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [searchInputValue, setSearchInputValue] = useState('')
  const debouncedSearchRef = useRef(null)

  // Debounced search function
  useEffect(() => {
    debouncedSearchRef.current = debounce((value) => {
      setGlobalFilter(value)
    }, 300)

    return () => {
      if (debouncedSearchRef.current) {
        debouncedSearchRef.current.cancel()
      }
    }
  }, [])

  // Handle search input change with debouncing
  const handleSearchChange = useCallback((value) => {
    setSearchInputValue(value)
    if (debouncedSearchRef.current) {
      debouncedSearchRef.current(value)
    }
  }, [])

  const fetchCustomers = useCallback(async () => {
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
  }, [])

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'ID',
        cell: (info) => <span className="font-medium">{info.getValue()}</span>,
      }),
      columnHelper.accessor('name', {
        header: 'Name',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('phone', {
        header: 'Phone',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('address', {
        header: 'Address',
        cell: (info) => info.getValue() || 'N/A',
      }),
      columnHelper.accessor('total_bookings', {
        header: 'Total Bookings',
        cell: (info) => info.getValue() || 0,
      }),
    ],
    []
  )

  const table = useReactTable({
    data: customers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnVisibility,
      globalFilter,
    },
    globalFilterFn: (row, columnId, filterValue) => {
      const search = filterValue.toLowerCase()
      const customer = row.original
      return (
        customer.name?.toLowerCase().includes(search) ||
        customer.email?.toLowerCase().includes(search) ||
        customer.phone?.toLowerCase().includes(search) ||
        customer.address?.toLowerCase().includes(search) ||
        customer.id?.toString().includes(search)
      )
    },
  })

  // Export to CSV
  const exportToCSV = useCallback(() => {
    const filteredData = table.getFilteredRowModel().rows.map(row => row.original)
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Address', 'Total Bookings']
    const rows = filteredData.map(customer => [
      customer.id,
      customer.name,
      customer.email,
      customer.phone,
      customer.address || 'N/A',
      customer.total_bookings || 0
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `customers_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success('Customers exported successfully!', {
      description: `${filteredData.length} customer(s) exported to CSV.`,
    })
    logActivity(ActivityType.EXPORT_CSV, {
      type: 'customers',
      count: filteredData.length,
    })
  }, [table])

  if (loading) {
    return (
      <div className="admin-customers" role="main" aria-label="Loading customers" aria-busy="true">
        <div className="customers-header">
          <Skeleton className="h-10 w-48 mb-4" />
        </div>
        <div className="customers-table-container">
          <div className="space-y-4" aria-live="polite">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <Skeleton className="h-10 w-full max-w-[400px]" />
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-customers" role="main" aria-label="Customers Management">
      <a href="#customers-content" className="skip-to-main">Skip to main content</a>
      {/* ARIA live region for dynamic updates */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {loading ? 'Loading customers...' : `${table.getFilteredRowModel().rows.length} customer${table.getFilteredRowModel().rows.length !== 1 ? 's' : ''} found`}
      </div>
      <div className="customers-header">
        <h1 id="customers-title">Customers</h1>
      </div>
      <div id="customers-content" className="customers-table-container" tabIndex={-1} aria-busy={loading}>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2 flex-wrap" role="search" aria-label="Search customers">
            <div className="search-input-wrapper flex-1 min-w-[250px]">
              <label htmlFor="customers-search" className="sr-only">Search customers</label>
              <Search className="search-icon" aria-hidden="true" />
              <Input
                id="customers-search"
                placeholder="Search by name, email, phone, address, or ID..."
                value={searchInputValue}
                onChange={(event) => handleSearchChange(event.target.value)}
                className="search-input"
                aria-label="Search customers"
                aria-describedby="customers-search-description"
                aria-busy={loading}
              />
              <span id="customers-search-description" className="sr-only">Search customers by name, email, phone number, address, or customer ID</span>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                onClick={exportToCSV}
                aria-label="Export customers to CSV"
              >
                <Download className="h-4 w-4 mr-2" aria-hidden="true" />
                Export CSV
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Columns <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      )
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder ? null : (
                            <div
                              className={cn(
                                header.column.getCanSort() &&
                                  "cursor-pointer select-none flex items-center gap-2"
                              )}
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {header.column.getCanSort() && (
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                              )}
                            </div>
                          )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="text-center py-12"
                    >
                      <div className="empty-state">
                        <Users className="empty-state-icon" />
                        <h3 className="empty-state-title">
                          {globalFilter ? 'No customers found' : 'No customers yet'}
                        </h3>
                        <p className="empty-state-description">
                          {globalFilter 
                            ? `No customers match "${globalFilter}". Try a different search term.`
                            : 'Customers will appear here once they make their first booking.'}
                        </p>
                        {globalFilter && (
                          <Button
                            variant="outline"
                            onClick={() => setGlobalFilter('')}
                            className="mt-4"
                          >
                            Clear search
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredRowModel().rows.length} of{" "}
              {table.getCoreRowModel().rows.length} row(s) shown.
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Memoize the component to prevent unnecessary re-renders
export default memo(AdminCustomers)

