import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { CreatePost } from "@/components/create-post"

export default function CreatePostPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:ml-64 p-4 sm:p-6">
          <CreatePost />
        </main>
      </div>
    </div>
  )
}
