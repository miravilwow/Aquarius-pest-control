import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '../components/ui/sidebar'
import { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  Calendar,
  Wrench,
  Users,
  LogOut,
  History,
  Bell
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../components/ui/popover'
import { Badge } from '../components/ui/badge'
import { 
  getActivityLogs, 
  getActivityTypeLabel, 
  ActivityType,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getReadNotificationIds
} from '@/utils/activityLog'
import { format } from 'date-fns'

function AdminLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [readIds, setReadIds] = useState([])

  const BRAND_NAME = 'Aquarius Pest Control Services'
  const LOGO_SRC = '/image/logo.jpg'

  useEffect(() => {
    loadNotifications()
    // Refresh notifications every 5 seconds
    const interval = setInterval(loadNotifications, 5000)
    return () => clearInterval(interval)
  }, [])

  const loadNotifications = () => {
    const logs = getActivityLogs(10) // Get last 10 activities
    // Filter for important notifications
    const importantTypes = [
      ActivityType.BOOKING_CREATED,
      ActivityType.BOOKING_STATUS_CHANGED,
      ActivityType.SERVICE_CREATED,
      ActivityType.SERVICE_DELETED,
    ]
    const filtered = logs.filter(log => importantTypes.includes(log.type))
    const currentReadIds = getReadNotificationIds()
    setReadIds(currentReadIds)
    
    // Filter out read notifications
    const unreadNotifications = filtered.filter(log => !currentReadIds.includes(log.id))
    
    setNotifications(unreadNotifications)
    setUnreadCount(unreadNotifications.length)
  }

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const menuItems = [
    { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
    { title: 'Bookings', url: '/admin/bookings', icon: Calendar },
    { title: 'Services', url: '/admin/services', icon: Wrench },
    { title: 'Customers', url: '/admin/customers', icon: Users },
    { title: 'Activity Log', url: '/admin/activity-log', icon: History },
  ]

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-2">
            <img
              src={LOGO_SRC}
              alt={BRAND_NAME}
              className="h-8 w-8 rounded-md object-contain"
            />
            <div className="flex flex-col">
              <span className="font-semibold">{BRAND_NAME}</span>
              <span className="text-xs text-muted-foreground">Admin Panel</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.url
                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                      >
                        <Link to={item.url}>
                          <Icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout}>
                <LogOut />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <div className="flex-1" />
          <TooltipProvider>
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                      >
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm">Notifications</h4>
                      {unreadCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs"
                          onClick={() => {
                            const allIds = notifications.map(n => n.id)
                            markAllNotificationsAsRead(allIds)
                            loadNotifications()
                          }}
                        >
                          Mark all read
                        </Button>
                      )}
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                      {notifications.length > 0 ? (
                        <div className="space-y-2">
                          {notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className="p-3 border rounded-lg hover:bg-accent cursor-pointer transition-all duration-200"
                              onClick={() => {
                                // Mark notification as read immediately
                                markNotificationAsRead(notification.id)
                                
                                // Remove from list immediately for better UX
                                setNotifications(prev => prev.filter(n => n.id !== notification.id))
                                setUnreadCount(prev => Math.max(0, prev - 1))
                                
                                // Navigate if applicable
                                if (notification.details.bookingId) {
                                  navigate('/admin/bookings')
                                } else if (notification.details.serviceId) {
                                  navigate('/admin/services')
                                }
                                
                                // Reload notifications to sync with localStorage
                                setTimeout(() => {
                                  loadNotifications()
                                }, 200)
                              }}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <p className="text-sm font-medium">
                                    {getActivityTypeLabel(notification.type)}
                                  </p>
                                  {notification.details.bookingId && (
                                    <p className="text-xs text-muted-foreground">
                                      Booking #{notification.details.bookingId}
                                    </p>
                                  )}
                                  {notification.details.serviceName && (
                                    <p className="text-xs text-muted-foreground">
                                      {notification.details.serviceName}
                                    </p>
                                  )}
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {format(new Date(notification.timestamp), 'MMM dd, HH:mm')}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-sm text-muted-foreground">
                          No new notifications
                        </div>
                      )}
                    </div>
                    <div className="pt-2 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full"
                        onClick={() => navigate('/admin/activity-log')}
                      >
                        View all activities
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <ThemeToggle />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  Toggle theme
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/">Back to Home</Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  Go to client site
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default AdminLayout
