import { useState, useEffect, useMemo, useCallback, useRef, memo } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { logActivity, ActivityType } from '@/utils/activityLog'
import { Button } from '@/components/ui/button'
import { Trash2, CheckCircle2, XCircle, MoreHorizontal, Calendar as CalendarIcon, Download, Filter, X, Eye, Mail, Printer, Search } from 'lucide-react'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { format, startOfToday, startOfWeek, startOfMonth, subDays, subWeeks, subMonths } from 'date-fns'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
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
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { ArrowUpDown, ChevronDown } from 'lucide-react'
import { cn } from '@/utils/index'
import debounce from 'lodash.debounce'
import './AdminBookings.css'

// Column helper for table definition
const columnHelper = createColumnHelper()

function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState([])
  const [sorting, setSorting] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [serviceFilter, setServiceFilter] = useState('all')
  const [dateRange, setDateRange] = useState()
  const [showFilters, setShowFilters] = useState(false)
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [goToPageInput, setGoToPageInput] = useState('')
  const [searchInputValue, setSearchInputValue] = useState('')
  const debouncedSearchRef = useRef(null)

  // Helper function to get badge variant based on status
  const getStatusVariant = (status) => {
    switch (status) {
      case 'pending':
        return 'secondary'
      case 'confirmed':
        return 'default'
      case 'completed':
        return 'default'
      case 'cancelled':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  /**
   * Format status text to title case
   * @param {string} status - Status string
   * @returns {string} Formatted status (e.g., "Pending", "Confirmed")
   */
  const formatStatus = useCallback((status) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }, [])

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

  /**
   * Fetch all bookings from the API
   * @async
   * @returns {Promise<void>}
   */
  const fetchBookings = useCallback(async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await axios.get('http://localhost:5000/api/admin/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setBookings(response.data)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  // Get unique services for filter
  const uniqueServices = useMemo(() => {
    const services = [...new Set(bookings.map(b => b.service_name).filter(Boolean))]
    return services.sort()
  }, [bookings])

  const updateStatus = useCallback(async (id, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken')
      await axios.put(
        `http://localhost:5000/api/admin/bookings/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success('Booking status updated!', {
        description: `Status changed to ${formatStatus(newStatus)}.`,
      })
      logActivity(ActivityType.BOOKING_STATUS_CHANGED, {
        bookingId: id,
        status: newStatus,
      })
      fetchBookings()
    } catch (error) {
      console.error('Error updating booking:', error)
      toast.error('Error updating booking status', {
        description: error.response?.data?.message || 'Failed to update status. Please try again.',
      })
    }
  }, [formatStatus, fetchBookings])

  const toggleSelectAll = useCallback((checked, allRowIds) => {
    if (checked) {
      setSelectedIds(allRowIds)
    } else {
      setSelectedIds([])
    }
  }, [])

  const toggleSelectOne = useCallback((id, checked) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id])
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id))
    }
  }, [])

  /**
   * Update status for multiple selected bookings
   * @async
   * @param {string} newStatus - New status to apply
   * @returns {Promise<void>}
   */
  const bulkUpdateStatus = useCallback(async (newStatus) => {
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
      const count = selectedIds.length
      toast.success('Bookings updated!', {
        description: `${count} booking${count > 1 ? 's' : ''} ${count > 1 ? 'have' : 'has'} been updated to ${formatStatus(newStatus)}.`,
      })
      setSelectedIds([])
      fetchBookings()
    } catch (error) {
      console.error('Error updating selected bookings:', error)
      toast.error('Error updating bookings', {
        description: error.response?.data?.message || 'Failed to update selected bookings. Please try again.',
      })
    }
  }, [selectedIds, formatStatus, fetchBookings])

  const openDetailsModal = useCallback((booking) => {
    setSelectedBooking(booking)
    setShowDetailsModal(true)
  }, [])

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => {
              table.toggleAllPageRowsSelected(!!value)
              const allIds = table.getRowModel().rows.map((row) => row.original.id)
              toggleSelectAll(!!value, allIds)
            }}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={selectedIds.includes(row.original.id)}
            onCheckedChange={(checked) => {
              row.toggleSelected(!!checked)
              toggleSelectOne(row.original.id, checked)
            }}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      }),
      columnHelper.accessor('id', {
        header: 'ID',
        cell: (info) => <span className="font-medium">{info.getValue()}</span>,
      }),
      columnHelper.accessor('name', {
        header: 'Customer',
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
      columnHelper.accessor('service_name', {
        header: 'Service',
        cell: (info) => info.getValue() || 'N/A',
      }),
      columnHelper.accessor('preferred_date', {
        header: 'Date',
        cell: (info) => new Date(info.getValue()).toLocaleDateString(),
      }),
      columnHelper.accessor('preferred_time', {
        header: 'Time',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => (
          <Badge variant={getStatusVariant(info.getValue())}>
            {formatStatus(info.getValue())}
          </Badge>
        ),
      }),
      columnHelper.display({
        id: 'actions',
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => openDetailsModal(row.original)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateStatus(row.original.id, 'pending')}>
                  Set to Pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateStatus(row.original.id, 'confirmed')}>
                  Set to Confirmed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateStatus(row.original.id, 'completed')}>
                  Set to Completed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateStatus(row.original.id, 'cancelled')}>
                  Set to Cancelled
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
      }),
    ],
    [selectedIds, toggleSelectAll, toggleSelectOne, updateStatus, openDetailsModal, getStatusVariant, formatStatus]
  )

  // Filter bookings based on status, service, and date range
  const filteredBookings = useMemo(() => {
    let filtered = bookings

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter)
    }

    // Apply service filter
    if (serviceFilter !== 'all') {
      filtered = filtered.filter(booking => booking.service_name === serviceFilter)
    }

    // Apply date range filter
    if (dateRange?.from) {
      const from = new Date(
        dateRange.from.getFullYear(),
        dateRange.from.getMonth(),
        dateRange.from.getDate(),
        0, 0, 0, 0
      )
      const toSource = dateRange.to ?? dateRange.from
      const to = new Date(
        toSource.getFullYear(),
        toSource.getMonth(),
        toSource.getDate(),
        23, 59, 59, 999
      )
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.preferred_date)
        return bookingDate >= from && bookingDate <= to
      })
    }

    return filtered
  }, [bookings, statusFilter, serviceFilter, dateRange])

  /**
   * Apply quick date filter (today, this week, this month, last 30 days)
   * @param {string} filterType - Filter type (today, thisWeek, thisMonth, last30Days)
   * @returns {void}
   */
  const applyQuickFilter = useCallback((filterType) => {
    const today = startOfToday()
    let from, to

    switch (filterType) {
      case 'today':
        from = today
        to = today
        break
      case 'thisWeek':
        from = startOfWeek(today, { weekStartsOn: 1 })
        to = today
        break
      case 'thisMonth':
        from = startOfMonth(today)
        to = today
        break
      case 'last30Days':
        from = subDays(today, 30)
        to = today
        break
      default:
        return
    }

    setDateRange({ from, to })
  }, [])

  const table = useReactTable({
    data: filteredBookings,
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
      pagination,
    },
    onPaginationChange: setPagination,
    globalFilterFn: (row, columnId, filterValue) => {
      const search = filterValue.toLowerCase()
      const booking = row.original
      return (
        booking.name?.toLowerCase().includes(search) ||
        booking.email?.toLowerCase().includes(search) ||
        booking.phone?.toLowerCase().includes(search) ||
        booking.service_name?.toLowerCase().includes(search) ||
        booking.id?.toString().includes(search)
      )
    },
  })

  /**
   * Export filtered bookings to CSV file
   * @returns {void}
   */
  const exportToCSV = useCallback(() => {
    const headers = ['ID', 'Customer', 'Email', 'Phone', 'Service', 'Date', 'Time', 'Status']
    const rows = filteredBookings.map(booking => [
      booking.id,
      booking.name,
      booking.email,
      booking.phone,
      booking.service_name || 'N/A',
      new Date(booking.preferred_date).toLocaleDateString(),
      booking.preferred_time,
      booking.status
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `bookings_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success('Bookings exported successfully!', {
      description: `${filteredBookings.length} booking(s) exported to CSV.`,
    })
    logActivity(ActivityType.EXPORT_CSV, {
      type: 'bookings',
      count: filteredBookings.length,
    })
  }, [filteredBookings])

  const clearFilters = useCallback(() => {
    setStatusFilter('all')
    setServiceFilter('all')
    setDateRange(undefined)
    setGlobalFilter('')
    toast.info('Filters cleared')
  }, [])

  const activeFiltersCount = (statusFilter !== 'all' ? 1 : 0) + (serviceFilter !== 'all' ? 1 : 0) + (dateRange ? 1 : 0) + (globalFilter ? 1 : 0)

  const handleGoToPage = useCallback(() => {
    const page = parseInt(goToPageInput)
    const maxPage = Math.ceil(table.getFilteredRowModel().rows.length / pagination.pageSize)
    if (page >= 1 && page <= maxPage) {
      table.setPageIndex(page - 1)
      setGoToPageInput('')
    } else {
      toast.error(`Please enter a page number between 1 and ${maxPage}`)
    }
  }, [table, pagination.pageSize, goToPageInput, toast])

  if (loading) {
    return (
      <div className="admin-bookings" role="main" aria-label="Loading bookings">
        <div className="bookings-header">
          <Skeleton className="h-10 w-64 mb-4" />
        </div>
        <div className="bookings-table-container">
          <div className="space-y-4" aria-live="polite" aria-busy="true">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <Skeleton className="h-10 w-full max-w-[400px]" />
              <Skeleton className="h-10 w-32" />
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
    <div className="admin-bookings" role="main" aria-label="Bookings Management">
      <a href="#bookings-content" className="skip-to-main">Skip to main content</a>
      {/* ARIA live region for dynamic updates */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {loading ? 'Loading bookings...' : `${filteredBookings.length} booking${filteredBookings.length !== 1 ? 's' : ''} found`}
      </div>
      <div className="bookings-header">
        <h1 id="bookings-title">Bookings Management</h1>
      </div>
      <div id="bookings-content" className="bookings-table-container" aria-busy={loading}>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="search-input-wrapper flex-1 min-w-[250px]">
              <label htmlFor="bookings-search" className="sr-only">Search bookings</label>
              <Search className="search-icon" aria-hidden="true" />
              <Input
                id="bookings-search"
                placeholder="Search by name, email, phone, service, or ID..."
                value={searchInputValue}
                onChange={(event) => handleSearchChange(event.target.value)}
                className="search-input"
                aria-label="Search bookings"
                aria-describedby="bookings-search-description"
                aria-busy={loading}
              />
              <span id="bookings-search-description" className="sr-only">
                Search bookings by customer name, email, phone number, service name, or booking ID
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Popover open={showFilters} onOpenChange={setShowFilters}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="relative"
                    aria-label={`Filters${activeFiltersCount > 0 ? `, ${activeFiltersCount} active` : ''}`}
                    aria-expanded={showFilters}
                    aria-haspopup="true"
                  >
                    <Filter className="h-4 w-4 mr-2" aria-hidden="true" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs" aria-label={`${activeFiltersCount} active filters`}>
                        {activeFiltersCount}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Quick Filters</label>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant={dateRange?.from?.getTime() === startOfToday().getTime() && !dateRange?.to ? "default" : "outline"}
                          size="sm"
                          onClick={() => applyQuickFilter('today')}
                        >
                          Today
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => applyQuickFilter('thisWeek')}
                        >
                          This Week
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => applyQuickFilter('thisMonth')}
                        >
                          This Month
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => applyQuickFilter('last30Days')}
                        >
                          Last 30 Days
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Status</label>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="All statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Service</label>
                      <Select value={serviceFilter} onValueChange={setServiceFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="All services" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Services</SelectItem>
                          {uniqueServices.map(service => (
                            <SelectItem key={service} value={service}>{service}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Date Range</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange?.from ? (
                              dateRange.to ? (
                                <>
                                  {format(dateRange.from, "MM/dd/yyyy")} -{" "}
                                  {format(dateRange.to, "MM/dd/yyyy")}
                                </>
                              ) : (
                                format(dateRange.from, "MM/dd/yyyy")
                              )
                            ) : (
                              <span>Pick a date range</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="range"
                            defaultMonth={dateRange?.from}
                            selected={dateRange}
                            onSelect={setDateRange}
                            numberOfMonths={1}
                            className="rounded-lg border"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    {activeFiltersCount > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearFilters}
                        className="w-full"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Clear Filters
                      </Button>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
              <Button 
                variant="outline" 
                onClick={exportToCSV}
                aria-label="Export bookings to CSV"
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
            <Table role="table" aria-label="Bookings table">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : (
                              <div
                                className={cn(
                                  header.column.getCanSort() &&
                                    "cursor-pointer select-none flex items-center gap-2"
                                )}
                                onClick={header.column.getToggleSortingHandler()}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault()
                                    header.column.getToggleSortingHandler()?.()
                                  }
                                }}
                                role="button"
                                tabIndex={header.column.getCanSort() ? 0 : -1}
                                aria-sort={
                                  header.column.getIsSorted() === 'asc'
                                    ? 'ascending'
                                    : header.column.getIsSorted() === 'desc'
                                    ? 'descending'
                                    : 'none'
                                }
                                aria-label={`Sort by ${flexRender(header.column.columnDef.header, header.getContext())}`}
                              >
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                                {header.column.getCanSort() && (
                                  <ArrowUpDown className="ml-2 h-4 w-4" aria-hidden="true" />
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
                      aria-selected={row.getIsSelected()}
                      role="row"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} role="gridcell">
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
                      role="status"
                      aria-live="polite"
                    >
                      <div className="empty-state">
                        <h3 className="empty-state-title">
                          {(globalFilter || statusFilter !== 'all' || dateRange) ? 'No bookings found' : 'No bookings yet'}
                        </h3>
                        <p className="empty-state-description">
                          {(globalFilter || statusFilter !== 'all' || dateRange)
                            ? 'No bookings match your filters. Try adjusting your search or filters.'
                            : 'Bookings will appear here once customers start making reservations.'}
                        </p>
                        {(globalFilter || statusFilter !== 'all' || serviceFilter !== 'all' || dateRange) && (
                          <Button
                            variant="outline"
                            onClick={clearFilters}
                            className="mt-4"
                            aria-label="Clear all filters"
                          >
                            Clear filters
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows per page:</span>
              <Select
                value={pagination.pageSize.toString()}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                  setPagination(prev => ({ ...prev, pageSize: Number(value), pageIndex: 0 }))
                }}
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 text-sm text-muted-foreground text-center">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()} ({table.getFilteredRowModel().rows.length} total)
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Go to:</span>
                <Input
                  type="number"
                  min="1"
                  max={table.getPageCount()}
                  value={goToPageInput}
                  onChange={(e) => setGoToPageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleGoToPage()
                    }
                  }}
                  className="w-16 h-8"
                  placeholder="Page"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGoToPage}
                >
                  Go
                </Button>
              </div>
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

      {/* View Details Modal */}
      <Dialog 
        open={showDetailsModal} 
        onOpenChange={setShowDetailsModal}
        onEscapeKeyDown={() => setShowDetailsModal(false)}
      >
        <DialogContent 
          className="max-w-2xl max-h-[90vh] overflow-y-auto"
          onEscapeKeyDown={(e) => {
            e.preventDefault()
            setShowDetailsModal(false)
          }}
          aria-describedby="booking-details-description"
        >
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription id="booking-details-description">
              Complete information about this booking
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Booking ID</label>
                  <p className="text-sm font-semibold">{selectedBooking.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <Badge variant={getStatusVariant(selectedBooking.status)}>
                      {formatStatus(selectedBooking.status)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Customer Name</label>
                  <p className="text-sm">{selectedBooking.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-sm">{selectedBooking.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p className="text-sm">{selectedBooking.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Service</label>
                  <p className="text-sm">{selectedBooking.service_name || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Preferred Date</label>
                  <p className="text-sm">{new Date(selectedBooking.preferred_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Preferred Time</label>
                  <p className="text-sm">{selectedBooking.preferred_time}</p>
                </div>
                {selectedBooking.address && (
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">Address</label>
                    <p className="text-sm">{selectedBooking.address}</p>
                  </div>
                )}
                {selectedBooking.message && (
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">Message</label>
                    <p className="text-sm">{selectedBooking.message}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created At</label>
                  <p className="text-sm">{new Date(selectedBooking.created_at).toLocaleString()}</p>
                </div>
                {selectedBooking.updated_at && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                    <p className="text-sm">{new Date(selectedBooking.updated_at).toLocaleString()}</p>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowDetailsModal(false)}>
                  Close
                </Button>
                <Button variant="outline" onClick={() => {
                  window.open(`mailto:${selectedBooking.email}?subject=Booking #${selectedBooking.id}`, '_blank')
                }}>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                <Button variant="outline" onClick={() => {
                  window.print()
                }}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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

// Memoize the component to prevent unnecessary re-renders
export default memo(AdminBookings)

