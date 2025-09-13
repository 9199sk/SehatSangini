"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Heart,
  Activity,
  Calendar,
  MessageSquare,
  Settings,
  Award,
  TrendingUp,
  Clock,
  Target,
  BookOpen,
  Stethoscope,
  Edit,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"

interface HealthMetric {
  id: string
  name: string
  value: string
  unit: string
  status: "good" | "warning" | "critical"
  lastUpdated: string
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ElementType
  earned: boolean
  progress?: number
}

const mockHealthMetrics: HealthMetric[] = [
  {
    id: "1",
    name: "Blood Pressure",
    value: "120/80",
    unit: "mmHg",
    status: "good",
    lastUpdated: "2 hours ago",
  },
  {
    id: "2",
    name: "Heart Rate",
    value: "72",
    unit: "bpm",
    status: "good",
    lastUpdated: "1 hour ago",
  },
  {
    id: "3",
    name: "Weight",
    value: "68.5",
    unit: "kg",
    status: "good",
    lastUpdated: "This morning",
  },
  {
    id: "4",
    name: "Sleep",
    value: "6.5",
    unit: "hours",
    status: "warning",
    lastUpdated: "Last night",
  },
]

const mockAchievements: Achievement[] = [
  {
    id: "1",
    title: "Health Tracker",
    description: "Log health metrics for 7 days",
    icon: Activity,
    earned: true,
  },
  {
    id: "2",
    title: "Community Helper",
    description: "Help 10 community members",
    icon: Heart,
    earned: true,
  },
  {
    id: "3",
    title: "Knowledge Seeker",
    description: "Read 20 health articles",
    icon: BookOpen,
    earned: false,
    progress: 75,
  },
  {
    id: "4",
    title: "Consultation Expert",
    description: "Complete 5 AI consultations",
    icon: Stethoscope,
    earned: false,
    progress: 40,
  },
]

export function UserDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "health" | "activity" | "settings">("overview")
  const { user } = useAuth()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30"
      case "warning":
        return "text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30"
      case "critical":
        return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30"
      default:
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30"
    }
  }

  return (
    <div className="w-full max-w-none overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8 p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8">
        {/* Header - Mobile optimized */}
        <div className="flex flex-col space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
            <div className="space-y-1.5 sm:space-y-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight">
                Dashboard
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed">
                Welcome back! Here's your health overview.
              </p>
            </div>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-transparent hover:bg-accent/80 self-start sm:self-auto px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base"
            >
              <Settings className="h-4 w-4" />
              <span className="font-medium">Settings</span>
            </Button>
          </div>
        </div>

        {/* User Profile Card - Enhanced mobile layout */}
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 ring-2 ring-primary/20 self-center sm:self-start">
                  <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || "User"} />
                  <AvatarFallback className="text-lg sm:text-xl lg:text-2xl font-semibold bg-primary/10 text-primary">
                    {user?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2 sm:space-y-3 text-center sm:text-left flex-1">
                  <div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground">
                      {user?.name || "Guest User"}
                    </h2>
                    <p className="text-muted-foreground text-sm sm:text-base">Member since January 2024</p>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 items-center sm:items-start">
                    <Badge variant="secondary" className="bg-primary/10 text-primary w-fit px-3 py-1.5 text-sm">
                      Community Member
                    </Badge>
                    <Badge variant="outline" className="w-fit px-3 py-1.5 text-sm">
                      Health Score: 85/100
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex justify-center sm:justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-transparent hover:bg-accent/80 px-4 py-2.5 text-sm"
                >
                  <Edit className="h-4 w-4" />
                  <span className="font-medium">Edit Profile</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Tabs - Mobile optimized with horizontal scroll */}
        <div className="border-b border-border">
          <div className="flex gap-1 sm:gap-2 overflow-x-auto pb-3 scrollbar-hide">
            {[
              { id: "overview", label: "Overview", icon: TrendingUp },
              { id: "health", label: "Health Metrics", icon: Activity },
              { id: "activity", label: "Activity", icon: Clock },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((tab) => {
              const IconComponent = tab.icon
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  onClick={() => setActiveTab(tab.id as any)}
                  className="flex items-center gap-2 whitespace-nowrap flex-shrink-0 px-3 sm:px-4 py-2.5 text-sm font-medium min-w-fit"
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="hidden xs:inline">{tab.label}</span>
                  <span className="xs:hidden">{tab.label.split(" ")[0]}</span>
                </Button>
              )
            })}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Quick Stats - Mobile-first responsive grid */}
            <div className="xl:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                <Card className="hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="pb-2 sm:pb-3">
                    <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2">
                      <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                      <span className="hidden sm:inline">Consultations</span>
                      <span className="sm:hidden">Consults</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 pt-0">
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">12</div>
                    <p className="text-xs text-muted-foreground">+2 this week</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="pb-2 sm:pb-3">
                    <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2">
                      <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 flex-shrink-0" />
                      <span className="hidden sm:inline">Community Posts</span>
                      <span className="sm:hidden">Posts</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 pt-0">
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">8</div>
                    <p className="text-xs text-muted-foreground">+1 this week</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="pb-2 sm:pb-3">
                    <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2">
                      <Target className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                      <span className="hidden sm:inline">Health Goals</span>
                      <span className="sm:hidden">Goals</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 pt-0">
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">3/5</div>
                    <p className="text-xs text-muted-foreground">On track</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="pb-2 sm:pb-3">
                    <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 flex-shrink-0" />
                      <span>Streak</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 pt-0">
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">15</div>
                    <p className="text-xs text-muted-foreground">days active</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity - Enhanced mobile layout */}
              <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg lg:text-xl">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    {[
                      { action: "Completed AI consultation", time: "2 hours ago", type: "consultation" },
                      { action: "Posted in community feed", time: "5 hours ago", type: "post" },
                      { action: "Updated health metrics", time: "1 day ago", type: "health" },
                      { action: "Read article on nutrition", time: "2 days ago", type: "education" },
                    ].map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors duration-200"
                      >
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-primary rounded-full flex-shrink-0 mt-1.5 sm:mt-2"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm sm:text-base font-medium text-foreground leading-relaxed">
                            {activity.action}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Achievements Sidebar - Mobile optimized */}
            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg lg:text-xl">
                    <Award className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-yellow-500" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 sm:space-y-5">
                    {mockAchievements.map((achievement) => {
                      const IconComponent = achievement.icon
                      return (
                        <div key={achievement.id} className="flex items-start gap-3 sm:gap-4">
                          <div
                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${
                              achievement.earned ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted"
                            }`}
                          >
                            <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                          </div>
                          <div className="flex-1 min-w-0 space-y-2">
                            <h4 className="text-sm sm:text-base font-semibold text-foreground leading-tight">
                              {achievement.title}
                            </h4>
                            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                              {achievement.description}
                            </p>
                            {!achievement.earned && achievement.progress && (
                              <div className="space-y-2">
                                <Progress value={achievement.progress} className="h-2" />
                                <p className="text-xs text-muted-foreground">{achievement.progress}% complete</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions - Enhanced mobile layout */}
              <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-base sm:text-lg lg:text-xl">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent hover:bg-accent/80 p-3 sm:p-4 h-auto"
                    asChild
                  >
                    <a href="/chatbot">
                      <Stethoscope className="h-4 w-4 sm:h-5 sm:w-5 mr-3 flex-shrink-0" />
                      <div className="text-left flex-1">
                        <div className="font-medium text-sm sm:text-base">Start Consultation</div>
                        <div className="text-xs text-muted-foreground">Get AI medical advice</div>
                      </div>
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent hover:bg-accent/80 p-3 sm:p-4 h-auto"
                    asChild
                  >
                    <a href="/create-post">
                      <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 mr-3 flex-shrink-0" />
                      <div className="text-left flex-1">
                        <div className="font-medium text-sm sm:text-base">Create Post</div>
                        <div className="text-xs text-muted-foreground">Share with community</div>
                      </div>
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent hover:bg-accent/80 p-3 sm:p-4 h-auto"
                  >
                    <Activity className="h-4 w-4 sm:h-5 sm:w-5 mr-3 flex-shrink-0" />
                    <div className="text-left flex-1">
                      <div className="font-medium text-sm sm:text-base">Log Health Data</div>
                      <div className="text-xs text-muted-foreground">Track your metrics</div>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "health" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {mockHealthMetrics.map((metric) => (
              <Card key={metric.id} className="hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-2 sm:pb-3">
                  <CardTitle className="text-sm sm:text-base font-medium">{metric.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                    {metric.value} <span className="text-sm font-normal text-muted-foreground">{metric.unit}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge className={`${getStatusColor(metric.status)} w-fit px-2 py-1 text-xs font-medium`}>
                      {metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
                    </Badge>
                    <p className="text-xs text-muted-foreground">{metric.lastUpdated}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "activity" && (
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Activity timeline will be displayed here.</p>
            </CardContent>
          </Card>
        )}

        {activeTab === "settings" && (
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Settings panel will be displayed here.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
