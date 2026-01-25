import { useState, useEffect } from 'react'
import { getActivityLogs, getActivityTypeLabel, clearActivityLogs, ActivityType } from '@/utils/activityLog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { History, Trash2, Download } from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import './AdminActivityLog.css'

function AdminActivityLog() {
  const [logs, setLogs] = useState([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadLogs()
  }, [filter])

  const loadLogs = () => {
    const allLogs = getActivityLogs()
    const filtered = filter === 'all' 
      ? allLogs 
      : allLogs.filter(log => log.type === filter)
    setLogs(filtered)
  }

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all activity logs?')) {
      clearActivityLogs()
      setLogs([])
      toast.success('Activity logs cleared')
    }
  }

  const handleExport = () => {
    const headers = ['Timestamp', 'Type', 'Details', 'User']
    const rows = logs.map(log => [
      log.timestamp,
      getActivityTypeLabel(log.type),
      JSON.stringify(log.details),
      log.user
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `activity_log_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success('Activity log exported successfully!')
  }

  const getActivityColor = (type) => {
    if (type.includes('created')) return 'default'
    if (type.includes('updated') || type.includes('changed')) return 'secondary'
    if (type.includes('deleted')) return 'destructive'
    return 'outline'
  }

  return (
    <div className="admin-activity-log">
      <div className="activity-log-header">
        <div>
          <h1>Activity Log</h1>
          <p className="text-muted-foreground">Track all admin actions and system events</p>
        </div>
        <div className="activity-log-actions">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Activities</SelectItem>
              <SelectItem value={ActivityType.BOOKING_STATUS_CHANGED}>Booking Changes</SelectItem>
              <SelectItem value={ActivityType.SERVICE_CREATED}>Service Created</SelectItem>
              <SelectItem value={ActivityType.SERVICE_UPDATED}>Service Updated</SelectItem>
              <SelectItem value={ActivityType.SERVICE_DELETED}>Service Deleted</SelectItem>
              <SelectItem value={ActivityType.EXPORT_CSV}>CSV Exports</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={handleClear}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>
            {logs.length} activity log{logs.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {logs.length > 0 ? (
            <div className="activity-log-list">
              {logs.map((log) => (
                <div key={log.id} className="activity-log-item">
                  <div className="activity-log-icon">
                    <History className="h-4 w-4" />
                  </div>
                  <div className="activity-log-content">
                    <div className="activity-log-header-row">
                      <Badge variant={getActivityColor(log.type)}>
                        {getActivityTypeLabel(log.type)}
                      </Badge>
                      <span className="activity-log-time">
                        {format(new Date(log.timestamp), 'MMM dd, yyyy HH:mm:ss')}
                      </span>
                    </div>
                    {log.details && Object.keys(log.details).length > 0 && (
                      <div className="activity-log-details">
                        {log.details.bookingId && (
                          <span>Booking ID: {log.details.bookingId}</span>
                        )}
                        {log.details.status && (
                          <span>Status: {log.details.status}</span>
                        )}
                        {log.details.serviceName && (
                          <span>Service: {log.details.serviceName}</span>
                        )}
                        {log.details.count && (
                          <span>Count: {log.details.count}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="activity-log-empty">
              <History className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No activity logs found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminActivityLog
