import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { ChatbotInterface } from "@/components/chatbot-interface"

export default function ChatbotPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:ml-64">
          <ChatbotInterface />
        </main>
      </div>
    </div>
  )
}
