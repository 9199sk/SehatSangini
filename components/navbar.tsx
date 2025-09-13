"use client"

import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Heart, User, Library, FileText, Plus, Menu, Bot, Calendar, Home, LogOut } from "lucide-react"
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth-provider"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()

  const navigationItems = [
    {
      href: "/disease-library",
      icon: Library,
      label: "Disease Library",
    },
    {
      href: "/sections",
      icon: FileText,
      label: "Sections",
    },
    {
      href: "/create-post",
      icon: Plus,
      label: "New Post",
    },
    {
      href: "/dashboard",
      icon: User,
      label: "User Dashboard",
    },
  ]

  const mobileNavigationItems = [
    {
      href: "/",
      icon: Home,
      label: "Home",
    },
    {
      href: "/disease-library",
      icon: Library,
      label: "Disease Library",
    },
    {
      href: "/chatbot",
      icon: Bot,
      label: "Chatbot AI",
    },
    {
      href: "/programs",
      icon: Calendar,
      label: "Offline Programs",
    },
    {
      href: "/sections",
      icon: FileText,
      label: "Sections",
    },
    {
      href: "/create-post",
      icon: Plus,
      label: "New Post",
    },
    {
      href: "/dashboard",
      icon: User,
      label: "User Dashboard",
    },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 border-b border-border bg-card/95 backdrop-blur-md z-[100] shadow-sm">
      <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8 py-2.5 sm:py-3 max-w-7xl mx-auto h-[60px] sm:h-[64px]">
        {/* Left: App Name - Mobile optimized */}
        <Link href="/" className="flex items-center space-x-1.5 sm:space-x-2 min-w-0 flex-shrink-0">
          <Heart className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 text-primary flex-shrink-0" />
          <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-foreground leading-tight">
            <span className="hidden xs:inline">Health Sangini</span>
            <span className="xs:hidden">Health</span>
          </h1>
        </Link>

        {/* Center: Desktop Navigation Menu - Hidden on mobile/tablet */}
        <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-all duration-200 px-3 py-2 rounded-lg hover:bg-accent/80"
            >
              <item.icon className="h-4 w-4" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
          <div className="ml-2">
            <ModeToggle />
          </div>
        </div>

        {/* Right: Mobile Menu + Premium Button */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3 flex-shrink-0">
          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 h-9 w-9 sm:h-10 sm:w-10 hover:bg-primary/10 rounded-lg"
                >
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px] bg-card border-border p-0">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-border">
                    <div className="flex items-center space-x-3">
                      <Heart className="h-6 w-6 text-primary" />
                      <h3 className="text-lg sm:text-xl font-semibold text-foreground">Health Sangini</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Access all features</p>
                  </div>

                  {/* Navigation Items */}
                  <div className="flex-1 px-2 sm:px-4 py-4 space-y-1 overflow-y-auto">
                    {mobileNavigationItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3 sm:space-x-4 text-foreground hover:text-primary transition-all duration-200 p-3 sm:p-4 rounded-xl hover:bg-accent/80"
                      >
                        <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <item.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                        </div>
                        <span className="font-medium text-sm sm:text-base">{item.label}</span>
                      </Link>
                    ))}
                  </div>

                  <div className="px-4 sm:px-6 py-4 border-t border-border flex-shrink-0">
                    {user ? (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-accent/50">
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
                            <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            logout()
                            setIsOpen(false)
                          }}
                          className="w-full justify-start text-foreground hover:bg-accent"
                        >
                          <LogOut className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="truncate">Sign Out</span>
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-accent/50">
                        <Avatar className="h-10 w-10 flex-shrink-0">
                          <AvatarFallback className="bg-muted">
                            <User className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">Guest User</p>
                          <p className="text-xs text-muted-foreground truncate">Sign in to access features</p>
                        </div>
                      </div>
                    )}

                    <div className="mt-4 pt-3 border-t border-border">
                      <ModeToggle />
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Premium Button - Responsive sizing */}
          <Link href="/premium">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-2.5 sm:px-3 md:px-4 lg:px-6 text-xs sm:text-sm lg:text-base shadow-lg hover:shadow-xl transition-all duration-200 h-9 sm:h-10 lg:h-11 rounded-lg">
              <span className="hidden sm:inline">Premium</span>
              <span className="sm:hidden">Pro</span>
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
