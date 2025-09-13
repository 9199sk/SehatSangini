"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ImagePlus, X, MapPin, Hash, Save, Send, Camera, Upload } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

interface PostDraft {
  images: string[]
  caption: string
  location: string
  hashtags: string[]
}

export function CreatePost() {
  const [step, setStep] = useState<"images" | "details">("images")
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [draft, setDraft] = useState<PostDraft>({
    images: [],
    caption: "",
    location: "",
    hashtags: [],
  })
  const [hashtagInput, setHashtagInput] = useState("")
  const { user } = useAuth()

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
      setSelectedImages([...selectedImages, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index))
  }

  const addHashtag = () => {
    if (hashtagInput.trim() && !draft.hashtags.includes(hashtagInput.trim())) {
      setDraft({
        ...draft,
        hashtags: [...draft.hashtags, hashtagInput.trim()],
      })
      setHashtagInput("")
    }
  }

  const removeHashtag = (hashtag: string) => {
    setDraft({
      ...draft,
      hashtags: draft.hashtags.filter((h) => h !== hashtag),
    })
  }

  const handleNext = () => {
    if (selectedImages.length > 0) {
      setDraft({ ...draft, images: selectedImages })
      setStep("details")
    }
  }

  const saveDraft = () => {
    // Save to local storage or backend
    console.log("Saving draft:", { ...draft, images: selectedImages })
    alert("Draft saved successfully!")
  }

  const publishPost = () => {
    // Publish the post
    console.log("Publishing post:", { ...draft, images: selectedImages })
    alert("Post published successfully!")
    // Reset form
    setSelectedImages([])
    setDraft({ images: [], caption: "", location: "", hashtags: [] })
    setStep("images")
  }

  return (
    <div className="w-full max-w-none overflow-x-hidden">
      <div className="max-w-full sm:max-w-2xl lg:max-w-4xl mx-auto">
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
              <Camera className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
              <span className="truncate">Create New Post</span>
            </CardTitle>
            {/* Enhanced mobile step indicators */}
            <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-4">
              <Badge
                variant={step === "images" ? "default" : "secondary"}
                className="text-xs sm:text-sm px-2 sm:px-3 py-1 flex-shrink-0"
              >
                <span className="hidden sm:inline">1. Select Images</span>
                <span className="sm:hidden">1. Images</span>
              </Badge>
              <Badge
                variant={step === "details" ? "default" : "secondary"}
                className="text-xs sm:text-sm px-2 sm:px-3 py-1 flex-shrink-0"
              >
                <span className="hidden sm:inline">2. Add Details</span>
                <span className="sm:hidden">2. Details</span>
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {step === "images" && (
              <div className="space-y-4 sm:space-y-5">
                {/* Image Upload Area - Enhanced mobile layout */}
                <div className="border-2 border-dashed border-border rounded-lg p-6 sm:p-8 text-center bg-muted/20 hover:bg-muted/30 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-3 sm:gap-4">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center">
                        <ImagePlus className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                      </div>
                      <div className="space-y-1 sm:space-y-2">
                        <p className="text-base sm:text-lg font-medium text-foreground">Upload Images</p>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed px-2">
                          <span className="hidden sm:inline">Click to select multiple images or drag and drop</span>
                          <span className="sm:hidden">Tap to select images</span>
                        </p>
                      </div>
                      <Button variant="outline" className="mt-2 sm:mt-3 bg-transparent min-h-[44px] px-4 sm:px-6">
                        <Upload className="h-4 w-4 mr-2" />
                        Choose Files
                      </Button>
                    </div>
                  </label>
                </div>

                {/* Selected Images Preview - Enhanced mobile grid */}
                {selectedImages.length > 0 && (
                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="font-medium text-foreground text-sm sm:text-base">
                      Selected Images ({selectedImages.length})
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                      {selectedImages.map((image, index) => (
                        <div key={index} className="relative group aspect-square">
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`Selected ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg border border-border/50"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-7 w-7 sm:h-8 sm:w-8 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shadow-md"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={handleNext}
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 min-h-[48px] sm:min-h-[44px] text-sm sm:text-base font-medium"
                    >
                      Next: Add Details
                    </Button>
                  </div>
                )}
              </div>
            )}

            {step === "details" && (
              <div className="space-y-5 sm:space-y-6">
                {/* User Info - Enhanced mobile layout */}
                {user && (
                  <div className="flex items-center gap-3 p-3 sm:p-4 bg-muted/50 rounded-lg border border-border/30">
                    <Avatar className="h-10 w-10 sm:h-12 sm:w-12 ring-2 ring-primary/10">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground text-sm sm:text-base truncate">{user.name}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Posting as community member</p>
                    </div>
                  </div>
                )}

                {/* Caption - Enhanced mobile textarea */}
                <div className="space-y-2 sm:space-y-3">
                  <label className="text-sm sm:text-base font-medium text-foreground">Caption</label>
                  <textarea
                    placeholder="Write a caption for your post..."
                    value={draft.caption}
                    onChange={(e) => setDraft({ ...draft, caption: e.target.value })}
                    className="w-full p-3 sm:p-4 border border-border rounded-lg bg-background min-h-[100px] sm:min-h-[120px] resize-none text-sm sm:text-base leading-relaxed focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                </div>

                {/* Location - Enhanced mobile input */}
                <div className="space-y-2 sm:space-y-3">
                  <label className="text-sm sm:text-base font-medium text-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    Location (Optional)
                  </label>
                  <Input
                    placeholder="Add location..."
                    value={draft.location}
                    onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                    className="min-h-[44px] sm:min-h-[40px] text-sm sm:text-base"
                  />
                </div>

                {/* Hashtags - Enhanced mobile layout */}
                <div className="space-y-2 sm:space-y-3">
                  <label className="text-sm sm:text-base font-medium text-foreground flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    Hashtags
                  </label>
                  <div className="flex gap-2 sm:gap-3">
                    <Input
                      placeholder="Add hashtag..."
                      value={hashtagInput}
                      onChange={(e) => setHashtagInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addHashtag()}
                      className="flex-1 min-h-[44px] sm:min-h-[40px] text-sm sm:text-base"
                    />
                    <Button
                      onClick={addHashtag}
                      variant="outline"
                      className="min-h-[44px] sm:min-h-[40px] px-4 sm:px-6 flex-shrink-0 bg-transparent"
                    >
                      Add
                    </Button>
                  </div>
                  {draft.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {draft.hashtags.map((hashtag) => (
                        <Badge
                          key={hashtag}
                          variant="secondary"
                          className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors px-2 py-1 text-xs sm:text-sm min-h-[32px] flex items-center"
                          onClick={() => removeHashtag(hashtag)}
                        >
                          #{hashtag}
                          <X className="h-3 w-3 ml-1 flex-shrink-0" />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selected Images Preview - Compact mobile view */}
                <div className="space-y-2 sm:space-y-3">
                  <label className="text-sm sm:text-base font-medium text-foreground">Selected Images</label>
                  <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
                    {selectedImages.map((image, index) => (
                      <img
                        key={index}
                        src={image || "/placeholder.svg"}
                        alt={`Selected ${index + 1}`}
                        className="w-full aspect-square object-cover rounded-lg border border-border/50"
                      />
                    ))}
                  </div>
                </div>

                {/* Action Buttons - Enhanced mobile layout */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
                  <Button
                    variant="outline"
                    onClick={() => setStep("images")}
                    className="w-full sm:flex-1 min-h-[48px] sm:min-h-[44px] order-3 sm:order-1"
                  >
                    Back to Images
                  </Button>
                  <Button
                    variant="outline"
                    onClick={saveDraft}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-transparent min-h-[48px] sm:min-h-[44px] px-4 sm:px-6 order-2"
                  >
                    <Save className="h-4 w-4" />
                    <span className="hidden sm:inline">Save Draft</span>
                    <span className="sm:hidden">Save</span>
                  </Button>
                  <Button
                    onClick={publishPost}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 min-h-[48px] sm:min-h-[44px] px-4 sm:px-6 order-1 sm:order-3"
                  >
                    <Send className="h-4 w-4" />
                    <span className="hidden sm:inline">Post Now</span>
                    <span className="sm:hidden">Post</span>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
