"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  verified?: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: () => Promise<void>
  logout: () => void
  requireAuth: (action: () => void) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      setIsLoading(true)
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check if user is logged in (simulate with localStorage)
      const savedUser = localStorage.getItem("health-sangini-user")
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = async () => {
    setIsLoading(true)
    // Simulate Google OAuth flow
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simulate Google user data
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@gmail.com",
      avatar: "/placeholder.svg?height=40&width=40&text=SJ",
      verified: true,
    }

    setUser(mockUser)
    localStorage.setItem("health-sangini-user", JSON.stringify(mockUser))
    setIsLoading(false)

    router.push("/")
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("health-sangini-user")
    router.push("/")
  }

  const requireAuth = (action: () => void) => {
    if (!user) {
      // Redirect to login/signup page
      router.push("/auth")
    } else {
      action()
    }
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout, requireAuth }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
