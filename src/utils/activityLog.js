// Activity Log Utility
// Stores activity logs in localStorage for demo purposes
// In production, this would be stored in a database

const ACTIVITY_LOG_KEY = 'admin_activity_log'
const READ_NOTIFICATIONS_KEY = 'admin_read_notifications'
const MAX_LOG_ENTRIES = 100

export const ActivityType = {
  BOOKING_CREATED: 'booking_created',
  BOOKING_UPDATED: 'booking_updated',
  BOOKING_DELETED: 'booking_deleted',
  BOOKING_STATUS_CHANGED: 'booking_status_changed',
  SERVICE_CREATED: 'service_created',
  SERVICE_UPDATED: 'service_updated',
  SERVICE_DELETED: 'service_deleted',
  CUSTOMER_VIEWED: 'customer_viewed',
  EXPORT_CSV: 'export_csv',
  LOGIN: 'login',
  LOGOUT: 'logout',
}

export const logActivity = (type, details = {}) => {
  try {
    const activity = {
      id: Date.now(),
      type,
      timestamp: new Date().toISOString(),
      details,
      user: 'admin', // In production, get from auth context
    }

    const logs = getActivityLogs()
    logs.unshift(activity) // Add to beginning

    // Keep only the last MAX_LOG_ENTRIES
    if (logs.length > MAX_LOG_ENTRIES) {
      logs.splice(MAX_LOG_ENTRIES)
    }

    localStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(logs))
    return activity
  } catch (error) {
    console.error('Error logging activity:', error)
  }
}

export const getActivityLogs = (limit = null) => {
  try {
    const logs = JSON.parse(localStorage.getItem(ACTIVITY_LOG_KEY) || '[]')
    return limit ? logs.slice(0, limit) : logs
  } catch (error) {
    console.error('Error getting activity logs:', error)
    return []
  }
}

export const clearActivityLogs = () => {
  try {
    localStorage.removeItem(ACTIVITY_LOG_KEY)
  } catch (error) {
    console.error('Error clearing activity logs:', error)
  }
}

export const getActivityTypeLabel = (type) => {
  const labels = {
    [ActivityType.BOOKING_CREATED]: 'Booking Created',
    [ActivityType.BOOKING_UPDATED]: 'Booking Updated',
    [ActivityType.BOOKING_DELETED]: 'Booking Deleted',
    [ActivityType.BOOKING_STATUS_CHANGED]: 'Booking Status Changed',
    [ActivityType.SERVICE_CREATED]: 'Service Created',
    [ActivityType.SERVICE_UPDATED]: 'Service Updated',
    [ActivityType.SERVICE_DELETED]: 'Service Deleted',
    [ActivityType.CUSTOMER_VIEWED]: 'Customer Viewed',
    [ActivityType.EXPORT_CSV]: 'CSV Exported',
    [ActivityType.LOGIN]: 'Login',
    [ActivityType.LOGOUT]: 'Logout',
  }
  return labels[type] || type
}

// Notification read tracking
export const markNotificationAsRead = (notificationId) => {
  try {
    const readIds = getReadNotificationIds()
    if (!readIds.includes(notificationId)) {
      readIds.push(notificationId)
      localStorage.setItem(READ_NOTIFICATIONS_KEY, JSON.stringify(readIds))
    }
  } catch (error) {
    console.error('Error marking notification as read:', error)
  }
}

export const markAllNotificationsAsRead = (notificationIds) => {
  try {
    const readIds = getReadNotificationIds()
    notificationIds.forEach(id => {
      if (!readIds.includes(id)) {
        readIds.push(id)
      }
    })
    localStorage.setItem(READ_NOTIFICATIONS_KEY, JSON.stringify(readIds))
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
  }
}

export const getReadNotificationIds = () => {
  try {
    return JSON.parse(localStorage.getItem(READ_NOTIFICATIONS_KEY) || '[]')
  } catch (error) {
    console.error('Error getting read notification IDs:', error)
    return []
  }
}

export const clearReadNotifications = () => {
  try {
    localStorage.removeItem(READ_NOTIFICATIONS_KEY)
  } catch (error) {
    console.error('Error clearing read notifications:', error)
  }
}
