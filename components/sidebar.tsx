"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Home, Bot, Calendar, User, LogOut, BookOpen } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"
import { useIsMobile } from "@/hooks/use-mobile"

const sidebarItems = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Disease Library",
    href: "/disease-library",
    icon: BookOpen,
  },
  {
    title: "Chatbot-AI",
    href: "/chatbot",
    icon: Bot,
  },
  {
    title: "Offline Programs",
    href: "/programs",
    icon: Calendar,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const isMobile = useIsMobile()

  if (isMobile) {
    return null
  }

  return (
    <div className="fixed left-0 top-[73px] w-64 bg-sidebar border-r border-sidebar-border h-[calc(100vh-73px)] flex flex-col z-40 overflow-y-auto">
      {/* Navigation Items */}
      <div className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start space-x-3 h-12 text-left",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium truncate">{item.title}</span>
              </Button>
            </Link>
          )
        })}
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-t border-sidebar-border flex-shrink-0">
        {user ? (
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-2 rounded-lg bg-sidebar-accent/50">
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage src={user.avatar || "/placeholder.svg?key=21gku"} alt={user.name} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</p>
                <p className="text-xs text-sidebar-foreground/70 truncate">{user.email}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <LogOut className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">Sign Out</span>
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-3 p-2 rounded-lg bg-sidebar-accent/50">
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarFallback className="bg-muted">
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">Guest User</p>
              <p className="text-xs text-sidebar-foreground/70 truncate">Sign in to access features</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
