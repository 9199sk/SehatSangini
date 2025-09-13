"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Crown,
  Check,
  Sparkles,
  MessageSquare,
  Calendar,
  Shield,
  Zap,
  Users,
  Heart,
  Brain,
  Clock,
  Star,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"

interface PremiumFeature {
  icon: React.ElementType
  title: string
  description: string
  included: {
    basic: boolean
    premium: boolean
    pro: boolean
  }
}

interface PricingPlan {
  id: string
  name: string
  price: {
    monthly: number
    yearly: number
  }
  popular?: boolean
  features: string[]
  color: string
}

const premiumFeatures: PremiumFeature[] = [
  {
    icon: MessageSquare,
    title: "Unlimited AI Consultations",
    description: "Chat with AI specialists without daily limits",
    included: { basic: false, premium: true, pro: true },
  },
  {
    icon: Calendar,
    title: "Priority Scheduling",
    description: "Get faster response times and priority support",
    included: { basic: false, premium: true, pro: true },
  },
  {
    icon: Brain,
    title: "Advanced Health Analytics",
    description: "Detailed health insights and personalized recommendations",
    included: { basic: false, premium: false, pro: true },
  },
  {
    icon: Shield,
    title: "Enhanced Privacy",
    description: "Advanced encryption and data protection",
    included: { basic: false, premium: true, pro: true },
  },
  {
    icon: Users,
    title: "Family Health Plans",
    description: "Manage health for up to 5 family members",
    included: { basic: false, premium: false, pro: true },
  },
  {
    icon: Heart,
    title: "Wellness Tracking",
    description: "Advanced health metrics and progress tracking",
    included: { basic: false, premium: true, pro: true },
  },
]

const pricingPlans: PricingPlan[] = [
  {
    id: "basic",
    name: "Basic",
    price: { monthly: 0, yearly: 0 },
    features: ["5 AI consultations per day", "Basic community access", "Standard response time", "Basic health tips"],
    color: "border-border",
  },
  {
    id: "premium",
    name: "Premium",
    price: { monthly: 19, yearly: 190 },
    popular: true,
    features: [
      "Unlimited AI consultations",
      "Priority support",
      "Advanced health analytics",
      "Enhanced privacy protection",
      "Wellness tracking",
      "Premium community features",
    ],
    color: "border-primary",
  },
  {
    id: "pro",
    name: "Pro",
    price: { monthly: 39, yearly: 390 },
    features: [
      "Everything in Premium",
      "Family health plans (5 members)",
      "Advanced AI diagnostics",
      "Personal health coach",
      "Custom health programs",
      "24/7 priority support",
    ],
    color: "border-secondary",
  },
]

export function PremiumPlans() {
  const [isYearly, setIsYearly] = useState(false)
  const { user, requireAuth } = useAuth()

  const handleSubscribe = (planId: string) => {
    requireAuth(() => {
      console.log(`Subscribing to ${planId} plan`)
      // Handle subscription logic
    })
  }

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Premium Plans</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Unlock advanced health features and get personalized care with our premium subscriptions
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={cn("text-sm", !isYearly ? "text-foreground font-medium" : "text-muted-foreground")}>
              Monthly
            </span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} className="data-[state=checked]:bg-primary" />
            <span className={cn("text-sm", isYearly ? "text-foreground font-medium" : "text-muted-foreground")}>
              Yearly
            </span>
            <Badge variant="secondary" className="ml-2">
              Save 17%
            </Badge>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.id}
              className={cn(
                "relative transition-all duration-200 hover:shadow-lg",
                plan.color,
                plan.popular && "ring-2 ring-primary shadow-lg scale-105",
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">
                    ${isYearly ? plan.price.yearly : plan.price.monthly}
                  </span>
                  <span className="text-muted-foreground">/{isYearly ? "year" : "month"}</span>
                </div>
                {isYearly && plan.price.yearly > 0 && (
                  <p className="text-sm text-muted-foreground">
                    ${Math.round(plan.price.yearly / 12)}/month billed annually
                  </p>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  className={cn(
                    "w-full mt-6",
                    plan.id === "basic"
                      ? "variant-outline"
                      : plan.popular
                        ? "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                        : "bg-secondary hover:bg-secondary/90",
                  )}
                  variant={plan.id === "basic" ? "outline" : "default"}
                  size="lg"
                >
                  {plan.id === "basic" ? "Current Plan" : "Get Started"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Comparison */}
        <div className="bg-card rounded-lg border p-8">
          <h2 className="text-2xl font-bold text-center mb-8">Feature Comparison</h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-4">Features</th>
                  <th className="text-center py-4 px-4">Basic</th>
                  <th className="text-center py-4 px-4">Premium</th>
                  <th className="text-center py-4 px-4">Pro</th>
                </tr>
              </thead>
              <tbody>
                {premiumFeatures.map((feature, index) => {
                  const IconComponent = feature.icon
                  return (
                    <tr key={index} className="border-b border-border/50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <IconComponent className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{feature.title}</p>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-4 px-4">
                        {feature.included.basic ? (
                          <Check className="h-5 w-5 text-primary mx-auto" />
                        ) : (
                          <div className="h-5 w-5 mx-auto" />
                        )}
                      </td>
                      <td className="text-center py-4 px-4">
                        {feature.included.premium ? (
                          <Check className="h-5 w-5 text-primary mx-auto" />
                        ) : (
                          <div className="h-5 w-5 mx-auto" />
                        )}
                      </td>
                      <td className="text-center py-4 px-4">
                        {feature.included.pro ? (
                          <Check className="h-5 w-5 text-primary mx-auto" />
                        ) : (
                          <div className="h-5 w-5 mx-auto" />
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Premium Benefits */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold mb-8">Why Choose Premium?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Instant Access</h3>
              <p className="text-muted-foreground">
                Get immediate responses from AI specialists without waiting in queues
              </p>
            </div>
            <div className="space-y-4">
              <div className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto">
                <Sparkles className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold">Advanced AI</h3>
              <p className="text-muted-foreground">
                Access to the latest AI models with enhanced diagnostic capabilities
              </p>
            </div>
            <div className="space-y-4">
              <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                <Clock className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">24/7 Support</h3>
              <p className="text-muted-foreground">Round-the-clock priority support for all your health concerns</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
