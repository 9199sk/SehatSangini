"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Clock, Users, Plus, Search, Heart, Activity, Brain, Utensils } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"

interface Program {
  id: string
  title: string
  description: string
  organizer: string
  date: string
  time: string
  location: string
  address: string
  category: string
  participants: number
  maxParticipants: number
  isJoined: boolean
  tags: string[]
}

const mockPrograms: Program[] = [
  {
    id: "1",
    title: "Heart Health Awareness Workshop",
    description:
      "Learn about cardiovascular health, prevention strategies, and lifestyle modifications to maintain a healthy heart.",
    organizer: "Dr. Sarah Johnson",
    date: "2024-01-15",
    time: "10:00 AM - 12:00 PM",
    location: "Community Health Center",
    address: "123 Health Street, Medical District",
    category: "Cardiovascular",
    participants: 45,
    maxParticipants: 60,
    isJoined: false,
    tags: ["Heart Health", "Prevention", "Lifestyle"],
  },
  {
    id: "2",
    title: "Mental Wellness & Stress Management",
    description:
      "Interactive session on managing stress, anxiety, and building mental resilience through practical techniques.",
    organizer: "Dr. Michael Chen",
    date: "2024-01-18",
    time: "2:00 PM - 4:00 PM",
    location: "Wellness Center Downtown",
    address: "456 Wellness Ave, City Center",
    category: "Mental Health",
    participants: 32,
    maxParticipants: 40,
    isJoined: true,
    tags: ["Mental Health", "Stress", "Mindfulness"],
  },
  {
    id: "3",
    title: "Nutrition & Healthy Cooking Demo",
    description:
      "Hands-on cooking demonstration featuring healthy recipes and nutritional guidance for better eating habits.",
    organizer: "Nutritionist Lisa Park",
    date: "2024-01-20",
    time: "11:00 AM - 1:00 PM",
    location: "Culinary Institute",
    address: "789 Food Street, Culinary District",
    category: "Nutrition",
    participants: 28,
    maxParticipants: 35,
    isJoined: false,
    tags: ["Nutrition", "Cooking", "Healthy Eating"],
  },
]

export default function OfflineProgramsPage() {
  const [activeTab, setActiveTab] = useState<"browse" | "create">("browse")
  const [programs, setPrograms] = useState<Program[]>(mockPrograms)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const { user, requireAuth } = useAuth()

  const categories = [
    { id: "all", name: "All Programs", icon: Activity, color: "bg-primary/10 text-primary" },
    { id: "cardiovascular", name: "Cardiovascular", icon: Heart, color: "bg-red-100 text-red-700" },
    { id: "mental-health", name: "Mental Health", icon: Brain, color: "bg-purple-100 text-purple-700" },
    { id: "nutrition", name: "Nutrition", icon: Utensils, color: "bg-green-100 text-green-700" },
  ]

  const filteredPrograms = programs.filter((program) => {
    const matchesSearch =
      program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      selectedCategory === "all" || program.category.toLowerCase().replace(" ", "-") === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleJoinProgram = (programId: string) => {
    requireAuth(() => {
      setPrograms(
        programs.map((program) =>
          program.id === programId
            ? {
                ...program,
                isJoined: !program.isJoined,
                participants: program.isJoined ? program.participants - 1 : program.participants + 1,
              }
            : program,
        ),
      )
    })
  }

  const handleCreateProgram = (formData: any) => {
    requireAuth(() => {
      const newProgram: Program = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        organizer: user?.name || "Anonymous",
        date: formData.date,
        time: formData.time,
        location: formData.location,
        address: formData.address,
        category: formData.category,
        participants: 0,
        maxParticipants: Number.parseInt(formData.maxParticipants),
        isJoined: false,
        tags: formData.tags.split(",").map((tag: string) => tag.trim()),
      }
      setPrograms([newProgram, ...programs])
      setActiveTab("browse")
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Sidebar />
      <div className="flex">
        <main className="flex-1 lg:ml-64 pt-16 p-4 sm:p-6 overflow-x-hidden">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 text-balance">
                Offline Health Programs
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground text-pretty">
                Join local health awareness programs or create your own community events
              </p>
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-1 mb-6 bg-muted p-1 rounded-lg w-full sm:w-fit">
              <Button
                variant={activeTab === "browse" ? "default" : "ghost"}
                onClick={() => setActiveTab("browse")}
                className="px-4 sm:px-6 text-sm"
              >
                <Search className="h-4 w-4 mr-2" />
                Browse Programs
              </Button>
              <Button
                variant={activeTab === "create" ? "default" : "ghost"}
                onClick={() => setActiveTab("create")}
                className="px-4 sm:px-6 text-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Program
              </Button>
            </div>

            {activeTab === "browse" ? (
              <BrowsePrograms
                programs={filteredPrograms}
                categories={categories}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                onJoinProgram={handleJoinProgram}
              />
            ) : (
              <CreateProgram onCreateProgram={handleCreateProgram} />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

function BrowsePrograms({
  programs,
  categories,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  onJoinProgram,
}: any) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search programs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((category: any) => {
            const IconComponent = category.icon
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                <IconComponent className="h-3 w-3" />
                {category.name}
              </Button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((program: Program) => (
          <Card key={program.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{program.title}</CardTitle>
                  <CardDescription className="text-sm line-clamp-2">{program.description}</CardDescription>
                </div>
                <Badge variant="secondary" className="ml-2">
                  {program.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(program.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{program.time}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{program.location}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>
                    {program.participants}/{program.maxParticipants} participants
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {program.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <Button
                onClick={() => onJoinProgram(program.id)}
                className={cn(
                  "w-full",
                  program.isJoined && "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                )}
                disabled={!program.isJoined && program.participants >= program.maxParticipants}
              >
                {program.isJoined
                  ? "Leave Program"
                  : program.participants >= program.maxParticipants
                    ? "Program Full"
                    : "Join Program"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {programs.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No programs found</h3>
          <p className="text-muted-foreground">Try adjusting your search terms or filters</p>
        </div>
      )}
    </div>
  )
}

function CreateProgram({ onCreateProgram }: any) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    address: "",
    category: "Cardiovascular",
    maxParticipants: "50",
    tags: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCreateProgram(formData)
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      address: "",
      category: "Cardiovascular",
      maxParticipants: "50",
      tags: "",
    })
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create Health Awareness Program</CardTitle>
        <CardDescription>Organize a local health awareness event for your community</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Program Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Heart Health Workshop"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-input bg-background rounded-md"
                required
              >
                <option value="Cardiovascular">Cardiovascular</option>
                <option value="Mental Health">Mental Health</option>
                <option value="Nutrition">Nutrition</option>
                <option value="General Health">General Health</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your program, what participants will learn, and any special features..."
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                placeholder="e.g., 10:00 AM - 12:00 PM"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Venue Name *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Community Health Center"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxParticipants">Max Participants *</Label>
              <Input
                id="maxParticipants"
                type="number"
                value={formData.maxParticipants}
                onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                min="1"
                max="500"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Full Address *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Street address, city, state, zip code"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="e.g., Heart Health, Prevention, Lifestyle"
            />
          </div>

          <Button type="submit" className="w-full">
            Create Program
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
