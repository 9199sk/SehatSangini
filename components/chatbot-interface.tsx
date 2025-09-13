"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Heart,
  Brain,
  Stethoscope,
  Eye,
  Bone,
  Baby,
  Pill,
  Activity,
  Send,
  Mic,
  MicOff,
  MessageSquare,
  Clock,
  Sparkles,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useSearchParams } from "next/navigation"

interface DoctorCategory {
  id: string
  name: string
  icon: React.ElementType
  description: string
  available: boolean
}

interface ChatMessage {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  category?: string
}

interface ChatHistory {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
  category: string
}

interface UserDetails {
  name: string
  age: string
  gender: string
  location: string
  symptoms: string
  urgency: "low" | "medium" | "high"
}

const doctorCategories: DoctorCategory[] = [
  {
    id: "cardiology",
    name: "Cardiologist",
    icon: Heart,
    description: "Heart and cardiovascular health",
    available: true,
  },
  {
    id: "neurology",
    name: "Neurologist",
    icon: Brain,
    description: "Brain and nervous system",
    available: true,
  },
  {
    id: "general",
    name: "General Physician",
    icon: Stethoscope,
    description: "General health consultation",
    available: true,
  },
  {
    id: "ophthalmology",
    name: "Ophthalmologist",
    icon: Eye,
    description: "Eye and vision care",
    available: false,
  },
  {
    id: "orthopedics",
    name: "Orthopedist",
    icon: Bone,
    description: "Bone and joint health",
    available: true,
  },
  {
    id: "pediatrics",
    name: "Pediatrician",
    icon: Baby,
    description: "Child healthcare",
    available: true,
  },
  {
    id: "pharmacy",
    name: "Pharmacist",
    icon: Pill,
    description: "Medication guidance",
    available: true,
  },
  {
    id: "fitness",
    name: "Fitness Expert",
    icon: Activity,
    description: "Exercise and wellness",
    available: true,
  },
]

const mockChatHistory: ChatHistory[] = [
  {
    id: "1",
    title: "Heart Rate Concerns",
    lastMessage: "Thank you for the advice about monitoring my heart rate during exercise.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    category: "Cardiology",
  },
  {
    id: "2",
    title: "Nutrition Plan",
    lastMessage: "The meal plan you suggested has been working great!",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    category: "General",
  },
  {
    id: "3",
    title: "Sleep Issues",
    lastMessage: "I'll try the sleep hygiene tips you recommended.",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    category: "Neurology",
  },
]

export function ChatbotInterface() {
  const searchParams = useSearchParams()
  const [activeView, setActiveView] = useState<"consultation" | "categories" | "chat" | "history">("consultation")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const [userDetails, setUserDetails] = useState<UserDetails>({
    name: "",
    age: "",
    gender: "",
    location: "",
    symptoms: "",
    urgency: "low",
  })

  useEffect(() => {
    if (initialized) return

    const disease = searchParams.get("disease")
    const category = searchParams.get("category")

    if (disease && category) {
      let doctorCategory = "general"
      if (category === "cardiovascular") doctorCategory = "cardiology"
      else if (category === "neurological") doctorCategory = "neurology"
      else if (category === "respiratory") doctorCategory = "general"
      else if (category === "musculoskeletal") doctorCategory = "orthopedics"
      else if (category === "ophthalmology") doctorCategory = "ophthalmology"

      setSelectedCategory(doctorCategory)
      setActiveView("chat")

      const doctorCat = doctorCategories.find((cat) => cat.id === doctorCategory)
      setMessages([
        {
          id: "1",
          type: "ai",
          content: `Hello! I'm your AI ${doctorCat?.name || "Doctor"} specializing in ${disease}. I understand you're seeking information about this condition. How can I help you today? Please describe your specific concerns or symptoms related to ${disease}.`,
          timestamp: new Date(),
          category: doctorCat?.name || "Doctor",
        },
      ])
    }

    setInitialized(true)
  }, [searchParams, initialized])

  const handleStartConsultation = (categoryId: string) => {
    const category = doctorCategories.find((cat) => cat.id === categoryId)
    if (category && category.available) {
      setSelectedCategory(categoryId)
      setActiveView("chat")
      setMessages([
        {
          id: "1",
          type: "ai",
          content: `Hello ${userDetails.name}! I'm your AI ${category.name}. Based on your symptoms: "${userDetails.symptoms}", I'll help you with your ${category.description.toLowerCase()}. How can I assist you further?`,
          timestamp: new Date(),
          category: category.name,
        },
      ])
    }
  }

  const suggestDoctor = () => {
    const symptoms = userDetails.symptoms.toLowerCase()
    let suggestedCategory = "general"

    if (symptoms.includes("heart") || symptoms.includes("chest") || symptoms.includes("palpitation")) {
      suggestedCategory = "cardiology"
    } else if (symptoms.includes("head") || symptoms.includes("brain") || symptoms.includes("memory")) {
      suggestedCategory = "neurology"
    } else if (symptoms.includes("eye") || symptoms.includes("vision") || symptoms.includes("sight")) {
      suggestedCategory = "ophthalmology"
    } else if (symptoms.includes("bone") || symptoms.includes("joint") || symptoms.includes("muscle")) {
      suggestedCategory = "orthopedics"
    }

    return suggestedCategory
  }

  const handleConsultationSubmit = () => {
    if (userDetails.name && userDetails.symptoms) {
      const suggested = suggestDoctor()
      handleStartConsultation(suggested)
    }
  }

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")

    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content:
          "Thank you for sharing that information. Based on what you've described, I'd recommend consulting with a healthcare professional for a proper evaluation. In the meantime, here are some general suggestions...",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
    }, 1000)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  return (
    <div className="h-[calc(100vh-73px)] flex flex-col">
      <div className="border-b border-border bg-card/50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              AI Health Consultation
            </h1>
            <p className="text-muted-foreground mt-1">Get instant medical guidance from AI specialists</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={activeView === "consultation" ? "default" : "outline"}
              onClick={() => setActiveView("consultation")}
              size="sm"
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Start Consultation
            </Button>
            <Button
              variant={activeView === "categories" ? "default" : "outline"}
              onClick={() => setActiveView("categories")}
              size="sm"
            >
              Specialists
            </Button>
            <Button
              variant={activeView === "history" ? "default" : "outline"}
              onClick={() => setActiveView("history")}
              size="sm"
            >
              <Clock className="h-4 w-4 mr-2" />
              History
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6">
        {activeView === "consultation" && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Start Your Consultation
                </CardTitle>
                <p className="text-muted-foreground">
                  Please provide your basic details and symptoms for personalized care
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Full Name</label>
                    <Input
                      placeholder="Enter your name"
                      value={userDetails.name}
                      onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Age</label>
                    <Input
                      placeholder="Enter your age"
                      value={userDetails.age}
                      onChange={(e) => setUserDetails({ ...userDetails, age: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Gender</label>
                    <select
                      className="w-full p-2 border border-border rounded-md bg-background"
                      value={userDetails.gender}
                      onChange={(e) => setUserDetails({ ...userDetails, gender: e.target.value })}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Location</label>
                    <Input
                      placeholder="City, Country"
                      value={userDetails.location}
                      onChange={(e) => setUserDetails({ ...userDetails, location: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Describe Your Symptoms</label>
                  <textarea
                    className="w-full p-3 border border-border rounded-md bg-background min-h-[100px]"
                    placeholder="Please describe your symptoms in detail..."
                    value={userDetails.symptoms}
                    onChange={(e) => setUserDetails({ ...userDetails, symptoms: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Urgency Level</label>
                  <div className="flex gap-2">
                    {["low", "medium", "high"].map((level) => (
                      <Button
                        key={level}
                        variant={userDetails.urgency === level ? "default" : "outline"}
                        size="sm"
                        onClick={() => setUserDetails({ ...userDetails, urgency: level as "low" | "medium" | "high" })}
                        className={cn(
                          level === "high" && userDetails.urgency === level && "bg-destructive hover:bg-destructive/90",
                          level === "medium" && userDetails.urgency === level && "bg-orange-500 hover:bg-orange-600",
                        )}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleConsultationSubmit}
                  disabled={!userDetails.name || !userDetails.symptoms}
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                >
                  Start AI Consultation
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeView === "categories" && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-2">Choose Your Specialist</h2>
              <p className="text-muted-foreground">Select a medical specialist for personalized AI consultation</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {doctorCategories.map((category) => {
                const IconComponent = category.icon
                return (
                  <Card
                    key={category.id}
                    className={cn(
                      "cursor-pointer transition-all duration-200 hover:shadow-md",
                      category.available
                        ? "hover:border-primary/50 hover:bg-primary/5"
                        : "opacity-50 cursor-not-allowed",
                    )}
                    onClick={() => category.available && handleStartConsultation(category.id)}
                  >
                    <CardHeader className="text-center pb-2">
                      <div
                        className={cn(
                          "mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-2",
                          category.available ? "bg-primary/10" : "bg-muted",
                        )}
                      >
                        <IconComponent
                          className={cn("h-6 w-6", category.available ? "text-primary" : "text-muted-foreground")}
                        />
                      </div>
                      <CardTitle className="text-sm font-medium">{category.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 text-center">
                      <p className="text-xs text-muted-foreground mb-3">{category.description}</p>
                      <Badge variant={category.available ? "secondary" : "outline"} className="text-xs">
                        {category.available ? "Available" : "Offline"}
                      </Badge>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {activeView === "history" && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold text-foreground mb-6">Consultation History</h2>
            <div className="space-y-4">
              {mockChatHistory.map((chat) => (
                <Card
                  key={chat.id}
                  className="cursor-pointer hover:shadow-md transition-shadow duration-200"
                  onClick={() => {
                    setActiveView("chat")
                    setSelectedCategory("general")
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-foreground">{chat.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {chat.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{chat.lastMessage}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(chat.timestamp)}</p>
                      </div>
                      <MessageSquare className="h-4 w-4 text-muted-foreground ml-4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeView === "chat" && (
          <div className="max-w-4xl mx-auto h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={() => setActiveView("consultation")}>
                  ← Back
                </Button>
                <div>
                  <h2 className="font-semibold text-foreground">
                    {doctorCategories.find((cat) => cat.id === selectedCategory)?.name || "AI Doctor"}
                  </h2>
                  <p className="text-sm text-muted-foreground">Online now</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Active Session
              </Badge>
            </div>

            <Card className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn("flex gap-3", message.type === "user" ? "justify-end" : "justify-start")}
                    >
                      {message.type === "ai" && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={cn(
                          "max-w-[70%] rounded-lg p-3",
                          message.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                        )}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={cn(
                            "text-xs mt-1",
                            message.type === "user" ? "text-primary-foreground/70" : "text-muted-foreground",
                          )}
                        >
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                      {message.type === "user" && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>You</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="border-t border-border p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your health question..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsRecording(!isRecording)}
                    className={cn(isRecording && "bg-destructive text-destructive-foreground")}
                  >
                    {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  <Button onClick={handleSendMessage} disabled={!inputMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Press Enter to send • Click mic for voice input</p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
