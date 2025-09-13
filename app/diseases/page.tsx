import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { DiseaseLibrary } from "@/components/disease-library"

export default function DiseasesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:ml-64">
          <DiseaseLibrary />
        </main>
      </div>
    </div>
  )
}
