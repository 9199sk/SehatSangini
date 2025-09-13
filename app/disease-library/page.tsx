import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { DiseaseLibrary } from "@/components/disease-library"

export default function DiseaseLibraryPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex min-h-[calc(100vh-73px)]">
        <Sidebar />
        <main className="flex-1 w-full lg:ml-64 overflow-hidden">
          <div className="h-full">
            <DiseaseLibrary />
          </div>
        </main>
      </div>
    </div>
  )
}
