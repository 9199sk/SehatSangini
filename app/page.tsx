import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { CommunityFeed } from "@/components/community-feed"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex pt-[60px] sm:pt-[64px]">
        <Sidebar />
        <main className="flex-1 lg:ml-64 w-full min-w-0 overflow-x-hidden">
          <div className="p-3 sm:p-4 md:p-5 lg:p-6 max-w-full">
            <CommunityFeed />
          </div>
        </main>
      </div>
    </div>
  )
}
