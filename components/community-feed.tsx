"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { LoginModal } from "@/components/login-modal"
import { Heart, MessageCircle, Repeat2, Flag, MoreHorizontal, TrendingUp, Quote, Stethoscope, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"

interface Post {
  id: string
  author: {
    name: string
    avatar: string
    verified: boolean
    userType: "doctor" | "user"
  }
  content: string
  category: string
  timeAgo: string
  likes: number
  comments: number
  reposts: number
  isLiked: boolean
  isReposted: boolean
  trending?: boolean
}

const mockPosts: Post[] = [
  {
    id: "1",
    author: {
      name: "Dr. Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40&text=SJ",
      verified: true,
      userType: "doctor",
    },
    content:
      "Just completed a fascinating study on the benefits of morning meditation for cardiovascular health. The results show a 23% improvement in heart rate variability among participants who meditated for just 10 minutes daily. Mental health truly impacts physical wellness! 🧘‍♀️",
    category: "Cardiology",
    timeAgo: "2h",
    likes: 127,
    comments: 23,
    reposts: 15,
    isLiked: false,
    isReposted: false,
    trending: true,
  },
  {
    id: "2",
    author: {
      name: "Mike Chen",
      avatar: "/placeholder.svg?height=40&width=40&text=MC",
      verified: false,
      userType: "user",
    },
    content:
      "Has anyone tried the new intermittent fasting approach? I have been doing 16:8 for 3 months now and feeling amazing. Lost 15 pounds and my energy levels are through the roof! Would love to hear your experiences.",
    category: "Nutrition",
    timeAgo: "4h",
    likes: 89,
    comments: 34,
    reposts: 8,
    isLiked: true,
    isReposted: false,
  },
  {
    id: "3",
    author: {
      name: "Dr. Priya Patel",
      avatar: "/placeholder.svg?height=40&width=40&text=PP",
      verified: true,
      userType: "doctor",
    },
    content:
      "Reminder: Regular skin checks are crucial for early detection of skin cancer. Look for changes in moles using the ABCDE rule - Asymmetry, Border, Color, Diameter, Evolving. Schedule your annual dermatology appointment today!",
    category: "Dermatology",
    timeAgo: "6h",
    likes: 203,
    comments: 12,
    reposts: 45,
    isLiked: false,
    isReposted: true,
  },
]

export function CommunityFeed() {
  const [posts, setPosts] = useState<Post[]>(mockPosts)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const { user, requireAuth } = useAuth()

  const handleLike = (postId: string) => {
    requireAuth(() => {
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                isLiked: !post.isLiked,
                likes: post.isLiked ? post.likes - 1 : post.likes + 1,
              }
            : post,
        ),
      )
    })
  }

  const handleRepost = (postId: string) => {
    requireAuth(() => {
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                isReposted: !post.isReposted,
                reposts: post.isReposted ? post.reposts - 1 : post.reposts + 1,
              }
            : post,
        ),
      )
    })
  }

  const handleComment = () => {
    requireAuth(() => {
      // Handle comment action
      console.log("Opening comment dialog...")
    })
  }

  const handleReport = () => {
    requireAuth(() => {
      // Handle report action
      console.log("Opening report dialog...")
    })
  }

  return (
    <div className="w-full max-w-none overflow-x-hidden">
      <div className="max-w-full sm:max-w-2xl lg:max-w-4xl mx-auto space-y-3 sm:space-y-4 lg:space-y-6">
        {/* Header Section - Mobile optimized */}
        <div className="space-y-2 sm:space-y-3 lg:space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground leading-tight">
              Community Feed
            </h2>
            <Badge variant="secondary" className="flex items-center space-x-1 text-xs px-2 py-1 flex-shrink-0">
              <TrendingUp className="h-3 w-3" />
              <span className="hidden sm:inline">Trending</span>
              <span className="sm:hidden">Hot</span>
            </Badge>
          </div>

          {/* Motivational Quote - Enhanced mobile layout */}
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 shadow-sm">
            <CardContent className="p-3 sm:p-4 lg:p-5">
              <div className="flex items-start space-x-2 sm:space-x-3">
                <Quote className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 sm:mt-1 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm sm:text-base font-medium text-foreground leading-relaxed">
                    "Health is not about the weight you lose, but about the life you gain."
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">Daily Health Tip</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Posts Feed - Enhanced mobile-first layout */}
        <div className="space-y-3 sm:space-y-4 lg:space-y-5">
          {posts.map((post) => (
            <Card
              key={post.id}
              className="hover:shadow-md transition-shadow duration-200 overflow-hidden border-border/50"
            >
              <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-4 lg:p-6">
                <div className="flex items-start justify-between gap-2 sm:gap-3">
                  <div className="flex items-start space-x-2 sm:space-x-3 min-w-0 flex-1">
                    <Avatar className="h-9 w-9 sm:h-10 sm:w-10 lg:h-12 lg:w-12 flex-shrink-0 ring-2 ring-primary/10">
                      <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                      <AvatarFallback className="text-xs sm:text-sm font-medium bg-primary/10 text-primary">
                        {post.author.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1 space-y-1 sm:space-y-1.5">
                      <div className="flex items-center space-x-1 sm:space-x-2 flex-wrap gap-y-1">
                        <h4 className="font-semibold text-sm sm:text-base text-foreground truncate max-w-[120px] sm:max-w-none">
                          {post.author.name}
                        </h4>
                        {post.author.userType === "doctor" ? (
                          <div className="flex items-center space-x-1 flex-shrink-0">
                            <div className="h-4 w-4 sm:h-5 sm:w-5 bg-primary rounded-full flex items-center justify-center">
                              <Stethoscope className="h-2 w-2 sm:h-2.5 sm:w-2.5 text-primary-foreground" />
                            </div>
                            <Badge variant="outline" className="text-xs border-primary text-primary px-1.5 py-0.5">
                              <span className="hidden sm:inline">Doctor</span>
                              <span className="sm:hidden">Dr</span>
                            </Badge>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1 flex-shrink-0">
                            <div className="h-4 w-4 sm:h-5 sm:w-5 bg-secondary rounded-full flex items-center justify-center">
                              <User className="h-2 w-2 sm:h-2.5 sm:w-2.5 text-secondary-foreground" />
                            </div>
                            <Badge variant="outline" className="text-xs border-secondary text-secondary px-1.5 py-0.5">
                              <span className="hidden sm:inline">Community</span>
                              <span className="sm:hidden">User</span>
                            </Badge>
                          </div>
                        )}
                        {post.trending && (
                          <Badge
                            variant="outline"
                            className="text-xs border-orange-500 text-orange-600 px-1.5 py-0.5 flex-shrink-0"
                          >
                            <span className="hidden sm:inline">Trending</span>
                            <span className="sm:hidden">🔥</span>
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-1 sm:space-x-2 text-xs text-muted-foreground flex-wrap">
                        <Badge
                          variant={
                            post.category === "Cardiology" ||
                            post.category === "Dermatology" ||
                            post.category === "Neurology"
                              ? "medical"
                              : "secondary"
                          }
                          className="text-xs px-2 py-0.5 font-medium"
                        >
                          {post.category}
                        </Badge>
                        <span className="hidden sm:inline">•</span>
                        <span>{post.timeAgo}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0 hover:bg-muted/50">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="pt-0 p-3 sm:p-4 lg:p-6 lg:pt-0">
                {/* Post Content - Enhanced readability */}
                <p className="text-sm sm:text-base text-foreground leading-relaxed mb-4 sm:mb-5 text-pretty">
                  {post.content}
                </p>

                {/* Action Buttons - Mobile-first responsive design */}
                <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-border/50">
                  <div className="flex items-center space-x-4 sm:space-x-6 lg:space-x-8">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(post.id)}
                      className={cn(
                        "flex items-center space-x-1.5 sm:space-x-2 text-muted-foreground hover:text-primary transition-colors p-2 h-auto rounded-lg min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0",
                        post.isLiked && "text-primary bg-primary/5",
                      )}
                    >
                      <Heart className={cn("h-4 w-4 sm:h-5 sm:w-5", post.isLiked && "fill-current")} />
                      <span className="text-xs sm:text-sm font-medium">{post.likes}</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleComment}
                      className="flex items-center space-x-1.5 sm:space-x-2 text-muted-foreground hover:text-primary transition-colors p-2 h-auto rounded-lg min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0"
                    >
                      <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-xs sm:text-sm font-medium">{post.comments}</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRepost(post.id)}
                      className={cn(
                        "flex items-center space-x-1.5 sm:space-x-2 text-muted-foreground hover:text-secondary transition-colors p-2 h-auto rounded-lg min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0",
                        post.isReposted && "text-secondary bg-secondary/5",
                      )}
                    >
                      <Repeat2 className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-xs sm:text-sm font-medium">{post.reposts}</span>
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReport}
                    className="text-muted-foreground hover:text-destructive transition-colors p-2 h-auto rounded-lg min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0"
                  >
                    <Flag className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More Button - Enhanced mobile layout */}
        <div className="flex justify-center pt-4 sm:pt-6 lg:pt-8">
          <Button
            variant="outline"
            className="px-6 sm:px-8 lg:px-10 py-2.5 sm:py-3 bg-transparent text-sm sm:text-base font-medium hover:bg-accent/80 transition-colors duration-200"
          >
            Load More Posts
          </Button>
        </div>

        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      </div>
    </div>
  )
}
