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
import {
  LayoutDashboard,
  Calendar,
  Wrench,
  Users,
  LogOut,
  Bug
} from 'lucide-react'
import { Button } from '../components/ui/button'

function AdminLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const menuItems = [
    { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
    { title: 'Bookings', url: '/admin/bookings', icon: Calendar },
    { title: 'Services', url: '/admin/services', icon: Wrench },
    { title: 'Customers', url: '/admin/customers', icon: Users },
  ]

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-2">
            <img 
              src="https://scontent.fcrk1-2.fna.fbcdn.net/v/t39.30808-6/247517119_1040926690025783_3271896171650896471_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHqLT6Uvu1Sb4miuoT5evBDMK8cwDXLlT0wrxzANcuVPZQdasrVqaYWuL7pYsR2kK7oFpkhNnDfJjrKCVub_6QC&_nc_ohc=A7lOd25oVqgQ7kNvwGb-UVN&_nc_oc=AdlRYWfhADgPw8Fua-ezqUd4VugSjCCZoh7utbWex4t2jFcWekIGmywj9N89zexggJ0&_nc_zt=23&_nc_ht=scontent.fcrk1-2.fna&_nc_gid=thNKrsOKoV7VM-ptWgDBrg&oh=00_AfluMfHgJGV_F_py790i8kvV0hZGohjjy-gzO-WkXJoRxg&oe=694D5642" 
              alt="Aquarius Pest Control Services Logo" 
              className="h-8 w-8 rounded object-cover"
            />
            <div className="flex flex-col">
              <span className="font-semibold">Aquarius Pest Control</span>
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
        </header>
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default AdminLayout
