"use client"

import React from "react"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Search,
  Heart,
  Brain,
  Bone,
  Eye,
  Blinds as Lungs,
  AtomIcon as Stomach,
  Shield,
  AlertTriangle,
  Info,
  Users,
  BookOpen,
  ArrowLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useIsMobile } from "@/hooks/use-mobile"

interface Disease {
  id: string
  name: string
  category: string
  severity: "low" | "medium" | "high"
  prevalence: string
  description: string
  symptoms: string[]
  causes: string[]
  treatments: string[]
  prevention: string[]
  icon: React.ElementType
}

interface Category {
  id: string
  name: string
  icon: React.ElementType
  count: number
  color: string
}

const categories: Category[] = [
  { id: "all", name: "All Diseases", icon: BookOpen, count: 24, color: "bg-primary/10 text-primary" },
  { id: "cardiovascular", name: "Cardiovascular", icon: Heart, count: 6, color: "bg-red-100 text-red-700" },
  { id: "neurological", name: "Neurological", icon: Brain, count: 4, color: "bg-purple-100 text-purple-700" },
  { id: "respiratory", name: "Respiratory", icon: Lungs, count: 5, color: "bg-blue-100 text-blue-700" },
  { id: "digestive", name: "Digestive", icon: Stomach, count: 4, color: "bg-green-100 text-green-700" },
  { id: "musculoskeletal", name: "Musculoskeletal", icon: Bone, count: 3, color: "bg-orange-100 text-orange-700" },
  { id: "ophthalmology", name: "Eye Conditions", icon: Eye, count: 2, color: "bg-cyan-100 text-cyan-700" },
]

const diseases: Disease[] = [
  {
    id: "hypertension",
    name: "Hypertension (High Blood Pressure)",
    category: "cardiovascular",
    severity: "medium",
    prevalence: "Very Common",
    description:
      "A condition in which the blood vessels have persistently raised pressure. Blood pressure is created by the force of blood pushing against the walls of blood vessels as it is pumped by the heart.",
    symptoms: ["Headaches", "Shortness of breath", "Nosebleeds", "Chest pain", "Visual changes"],
    causes: ["Genetics", "Poor diet", "Lack of exercise", "Stress", "Obesity", "Excessive salt intake"],
    treatments: ["Lifestyle changes", "ACE inhibitors", "Diuretics", "Beta-blockers", "Regular monitoring"],
    prevention: ["Regular exercise", "Healthy diet", "Limit salt intake", "Maintain healthy weight", "Manage stress"],
    icon: Heart,
  },
  {
    id: "diabetes",
    name: "Type 2 Diabetes",
    category: "endocrine",
    severity: "high",
    prevalence: "Common",
    description:
      "A chronic condition that affects the way the body processes blood sugar (glucose). The body either resists the effects of insulin or doesn't produce enough insulin.",
    symptoms: ["Increased thirst", "Frequent urination", "Fatigue", "Blurred vision", "Slow healing wounds"],
    causes: ["Insulin resistance", "Genetics", "Obesity", "Sedentary lifestyle", "Age"],
    treatments: ["Metformin", "Insulin therapy", "Diet modification", "Exercise", "Blood sugar monitoring"],
    prevention: ["Maintain healthy weight", "Regular exercise", "Balanced diet", "Regular check-ups"],
    icon: Shield,
  },
  {
    id: "asthma",
    name: "Asthma",
    category: "respiratory",
    severity: "medium",
    prevalence: "Common",
    description:
      "A condition in which airways narrow and swell and may produce extra mucus. This can make breathing difficult and trigger coughing, wheezing, and shortness of breath.",
    symptoms: ["Wheezing", "Shortness of breath", "Chest tightness", "Coughing", "Difficulty sleeping"],
    causes: ["Allergens", "Air pollution", "Respiratory infections", "Physical activity", "Weather changes"],
    treatments: ["Inhalers", "Bronchodilators", "Corticosteroids", "Allergy medications", "Immunotherapy"],
    prevention: ["Avoid triggers", "Use air purifiers", "Regular medication", "Vaccination", "Monitor air quality"],
    icon: Lungs,
  },
  {
    id: "migraine",
    name: "Migraine",
    category: "neurological",
    severity: "medium",
    prevalence: "Common",
    description:
      "A neurological condition that can cause multiple symptoms including severe headaches, nausea, vomiting, and sensitivity to light and sound.",
    symptoms: ["Severe headache", "Nausea", "Vomiting", "Light sensitivity", "Sound sensitivity", "Visual aura"],
    causes: ["Genetics", "Hormonal changes", "Stress", "Certain foods", "Sleep changes", "Weather changes"],
    treatments: ["Pain relievers", "Triptans", "Preventive medications", "Lifestyle changes", "Stress management"],
    prevention: ["Regular sleep", "Stress management", "Avoid triggers", "Regular meals", "Stay hydrated"],
    icon: Brain,
  },
  {
    id: "arthritis",
    name: "Osteoarthritis",
    category: "musculoskeletal",
    severity: "medium",
    prevalence: "Very Common",
    description:
      "The most common form of arthritis, occurring when the protective cartilage that cushions the ends of bones wears down over time.",
    symptoms: ["Joint pain", "Stiffness", "Tenderness", "Loss of flexibility", "Grating sensation", "Bone spurs"],
    causes: ["Age", "Obesity", "Joint injuries", "Genetics", "Bone deformities", "Certain metabolic diseases"],
    treatments: ["Pain medications", "Physical therapy", "Occupational therapy", "Cortisone injections", "Surgery"],
    prevention: ["Maintain healthy weight", "Regular exercise", "Avoid joint injuries", "Good posture"],
    icon: Bone,
  },
  {
    id: "depression",
    name: "Major Depression",
    category: "neurological",
    severity: "high",
    prevalence: "Common",
    description:
      "A mental health disorder characterized by persistently depressed mood or loss of interest in activities, causing significant impairment in daily life.",
    symptoms: ["Persistent sadness", "Loss of interest", "Fatigue", "Sleep disturbances", "Appetite changes"],
    causes: ["Brain chemistry", "Genetics", "Life events", "Medical conditions", "Substance abuse"],
    treatments: ["Antidepressants", "Psychotherapy", "Lifestyle changes", "Support groups", "ECT in severe cases"],
    prevention: ["Regular exercise", "Social support", "Stress management", "Adequate sleep", "Healthy diet"],
    icon: Brain,
  },
]

export function DiseaseLibrary() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null)
  const { requireAuth } = useAuth()
  const router = useRouter()
  const isMobile = useIsMobile()

  const filteredDiseases = useMemo(() => {
    return diseases.filter((disease) => {
      const matchesSearch =
        disease.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        disease.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        disease.symptoms.some((symptom) => symptom.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === "all" || disease.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleConsultAIDoctor = () => {
    requireAuth(() => {
      if (selectedDisease) {
        // Redirect to chatbot with disease-specific context
        router.push(`/chatbot?disease=${encodeURIComponent(selectedDisease.name)}&category=${selectedDisease.category}`)
      }
    })
  }

  const handleBackToList = () => {
    setSelectedDisease(null)
  }

  return (
    <div className="min-h-[calc(100vh-73px)] flex flex-col lg:flex-row bg-background">
      {/* Left Panel - Disease List */}
      <div
        className={cn(
          "border-r border-border flex flex-col bg-card/50 overflow-hidden",
          isMobile ? (selectedDisease ? "hidden" : "w-full h-full") : "w-full lg:w-2/5 min-h-[calc(100vh-73px)]",
        )}
      >
        {/* Header - Mobile optimized */}
        <div className="p-3 sm:p-4 md:p-6 lg:p-8 border-b border-border bg-card/80 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground leading-tight">
                Disease Library
              </h1>
              <p className="text-muted-foreground text-xs sm:text-sm md:text-base leading-relaxed">
                Comprehensive medical information
              </p>
            </div>
          </div>

          {/* Search - Enhanced mobile layout */}
          <div className="relative mb-4 sm:mb-6">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search diseases, symptoms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base bg-background/50 border-border/50 focus:bg-background focus:border-primary/50 transition-all duration-200"
            />
          </div>

          {/* Categories - Mobile-first horizontal scroll */}
          <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 sm:pb-3 scrollbar-hide">
            {categories.map((category) => {
              const IconComponent = category.icon
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center gap-1.5 sm:gap-2 whitespace-nowrap flex-shrink-0 px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-medium min-w-fit"
                >
                  <IconComponent className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="hidden sm:inline">{category.name}</span>
                  <span className="sm:hidden">{category.name.split(" ")[0]}</span>
                  <Badge variant="secondary" className="ml-1 text-xs px-1.5 py-0.5 flex-shrink-0">
                    {category.count}
                  </Badge>
                </Button>
              )
            })}
          </div>
        </div>

        {/* Disease List - Enhanced mobile layout */}
        <ScrollArea className="flex-1">
          <div className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
            {filteredDiseases.map((disease) => {
              const IconComponent = disease.icon
              return (
                <Card
                  key={disease.id}
                  className={cn(
                    "cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-border/50",
                    selectedDisease?.id === disease.id && "ring-2 ring-primary bg-primary/5 shadow-md",
                  )}
                  onClick={() => setSelectedDisease(disease)}
                >
                  <CardContent className="p-3 sm:p-4 md:p-5">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-2 sm:space-y-3">
                        <div className="flex items-start justify-between gap-2 sm:gap-3">
                          <h3 className="font-semibold text-foreground text-sm sm:text-base leading-tight line-clamp-2">
                            {disease.name}
                          </h3>
                          <Badge className={cn("text-xs flex-shrink-0 px-2 py-1", getSeverityColor(disease.severity))}>
                            {disease.severity}
                          </Badge>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {disease.description}
                        </p>
                        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                          <Badge variant="outline" className="text-xs px-2 py-1">
                            {disease.prevalence}
                          </Badge>
                          <div className="flex items-center gap-1 sm:gap-1.5 text-xs text-muted-foreground">
                            <Users className="h-3 w-3 flex-shrink-0" />
                            <span className="hidden sm:inline capitalize">{disease.category}</span>
                            <span className="sm:hidden capitalize">{disease.category.slice(0, 8)}...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {filteredDiseases.length === 0 && (
              <div className="text-center py-12 sm:py-16">
                <Search className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">No diseases found</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Try adjusting your search terms or category filter
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Right Panel - Disease Details */}
      <div
        className={cn(
          "flex flex-col bg-background overflow-hidden",
          isMobile ? (selectedDisease ? "w-full h-full" : "hidden") : "w-full lg:w-3/5 min-h-[calc(100vh-73px)]",
        )}
      >
        {selectedDisease ? (
          <>
            {/* Mobile Back Button */}
            {isMobile && (
              <div className="p-3 sm:p-4 border-b border-border bg-card/80 backdrop-blur-sm flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToList}
                  className="flex items-center gap-2 hover:bg-accent/80 px-3 py-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="font-medium">Back to List</span>
                </Button>
              </div>
            )}

            <ScrollArea className="flex-1">
              <div className="p-3 sm:p-4 md:p-6 lg:p-8">
                {/* Disease Header - Mobile optimized */}
                <div className="mb-6 sm:mb-8">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 mb-4 sm:mb-6">
                    <div className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 ring-2 ring-primary/20 self-center sm:self-start">
                      {React.createElement(selectedDisease.icon, {
                        className: "h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-primary",
                      })}
                    </div>
                    <div className="flex-1 min-w-0 space-y-3 sm:space-y-4 text-center sm:text-left">
                      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                        {selectedDisease.name}
                      </h1>
                      <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center sm:justify-start">
                        <Badge
                          className={cn("text-sm px-3 py-1.5 font-medium", getSeverityColor(selectedDisease.severity))}
                        >
                          {selectedDisease.severity.charAt(0).toUpperCase() + selectedDisease.severity.slice(1)} Risk
                        </Badge>
                        <Badge variant="outline" className="px-3 py-1.5 text-sm">
                          {selectedDisease.prevalence}
                        </Badge>
                        <Badge variant="secondary" className="px-3 py-1.5 text-sm capitalize">
                          {selectedDisease.category}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground leading-relaxed text-sm sm:text-base lg:text-lg">
                        {selectedDisease.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Disease Information Sections - Enhanced mobile layout */}
                <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                  {/* Symptoms */}
                  <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="pb-3 sm:pb-4">
                      <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg lg:text-xl">
                        <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                          <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        Symptoms
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-2 sm:gap-3">
                        {selectedDisease.symptoms.map((symptom, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors duration-200"
                          >
                            <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-orange-500 flex-shrink-0" />
                            <span className="text-sm sm:text-base font-medium">{symptom}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Causes */}
                  <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="pb-3 sm:pb-4">
                      <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg lg:text-xl">
                        <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                          <Info className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        Causes & Risk Factors
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-2 sm:gap-3">
                        {selectedDisease.causes.map((cause, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors duration-200"
                          >
                            <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-blue-500 flex-shrink-0" />
                            <span className="text-sm sm:text-base font-medium">{cause}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Treatments */}
                  <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="pb-3 sm:pb-4">
                      <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg lg:text-xl">
                        <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                          <Heart className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-green-600 dark:text-green-400" />
                        </div>
                        Treatment Options
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-2 sm:gap-3">
                        {selectedDisease.treatments.map((treatment, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors duration-200"
                          >
                            <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-green-500 flex-shrink-0" />
                            <span className="text-sm sm:text-base font-medium">{treatment}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Prevention */}
                  <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="pb-3 sm:pb-4">
                      <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg lg:text-xl">
                        <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Shield className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-primary" />
                        </div>
                        Prevention
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-2 sm:gap-3">
                        {selectedDisease.prevention.map((prevention, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors duration-200"
                          >
                            <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-primary flex-shrink-0" />
                            <span className="text-sm sm:text-base font-medium">{prevention}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Action Buttons - Mobile optimized */}
                <div className="mt-6 sm:mt-8 lg:mt-12 flex flex-col gap-3 sm:gap-4">
                  <Button className="w-full py-3 px-6 text-base font-medium" onClick={handleConsultAIDoctor}>
                    <Heart className="h-5 w-5 mr-2" />
                    Consult AI Doctor
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent hover:bg-accent/80 py-3 px-6 text-base font-medium"
                  >
                    <BookOpen className="h-5 w-5 mr-2" />
                    Learn More
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-6 sm:p-8">
            <div className="text-center space-y-3 sm:space-y-4">
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground">Select a Disease</h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-md">
                Choose a condition from the list to view detailed information, symptoms, and treatment options
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
