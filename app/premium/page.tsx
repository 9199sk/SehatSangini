import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { PremiumPlans } from "@/components/premium-plans"

export default function PremiumPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:ml-64">
          <PremiumPlans />
        </main>
      </div>
    </div>
  )
}
