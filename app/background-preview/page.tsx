import { BackgroundPreview } from "@/components/background-preview"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function BackgroundPreviewPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 container py-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Background Preview</h1>
        <p className="text-center mb-8 text-gray-700 max-w-2xl mx-auto">
          This page shows a preview of how the app would look with the new cityscape background. Toggle between the
          current and new background to compare them.
        </p>
        <BackgroundPreview />
      </div>
      <Footer />
    </div>
  )
}
