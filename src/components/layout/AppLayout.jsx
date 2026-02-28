import { NavLink } from "@/components/layout/NavLink"
import { useLocation, useNavigate,  } from "react-router-dom"
import { useBookClub } from "@/context/BookClubContext"
import { useAuth } from "@/context/AuthContext"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  BarChart3,
  Target,
  Star,
  Sparkles,
  Video,
  Bell,
  Library,
  Trophy,
  Moon,
  Sun,
  Menu,
  LogOut,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Suggestions", url: "/suggestions", icon: BookOpen },
  { title: "Discussions", url: "/discussions", icon: MessageSquare },
  { title: "Progress", url: "/progress", icon: BarChart3 },
  { title: "Goals", url: "/goals", icon: Target },
  { title: "Reviews", url: "/reviews", icon: Star },
  { title: "Discover", url: "/discover", icon: Sparkles },
  { title: "Meetings", url: "/meetings", icon: Video },
  { title: "Library", url: "/library", icon: Library },
  { title: "Statistics", url: "/statistics", icon: Trophy },
]

export function AppLayout({ children }) {
  const {
    notifications,
    markNotificationRead,
    darkMode,
    toggleDarkMode,
  } = useBookClub()

  const { signOut, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleLogout = async () => {
    await signOut()
    navigate("/auth")
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="flex flex-col border-r border-sidebar-border">

          {/* Logo */}
          <div className="p-4 border-b border-sidebar-border">
            <h1 className="font-display text-xl font-bold text-sidebar-primary flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              <span>BookClub</span>
            </h1>
          </div>

          <SidebarContent className="flex-1">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground">
                Navigation
              </SidebarGroupLabel>

              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={item.url}
                          end={item.url === "/"}
                          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                          activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold"
                        >
                          <item.icon className="h-4 w-4 shrink-0" />
                          <span>{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          {/* 🔴 Logout Section */}
          {user && (
            <div className="p-4 border-t border-sidebar-border">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  >
                    <LogOut className="h-4 w-4 shrink-0" />
                    <span>Logout</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </div>
          )}
        </Sidebar>

        {/* Main Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 border-b flex items-center justify-between px-4 bg-card/80 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <SidebarTrigger>
                <Menu className="h-5 w-5" />
              </SidebarTrigger>

              <h2 className="font-display font-semibold text-lg">
                {navItems.find((i) =>
                  i.url === "/"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(i.url)
                )?.title || "BookClub"}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-80">
                  {notifications.slice(0, 8).map((n) => (
                    <DropdownMenuItem
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={n.read ? "opacity-60" : ""}
                    >
                      <div className="flex flex-col gap-1">
                        <span className="text-sm">{n.message}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(n.date).toLocaleDateString()}
                        </span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Dark Mode */}
              <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
                {darkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            </div>
          </header>

          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}