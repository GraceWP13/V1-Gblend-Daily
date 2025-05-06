import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { EndlessRunner } from "@/components/endless-runner"

export default function GamePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 container py-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">Tectra Runner Game</h1>
        <p className="text-center mb-8 text-purple-100 max-w-2xl mx-auto">
          Jump over buildings and collect Tectra coins in this endless runner game. Press Space or click/tap to jump!
        </p>
        <EndlessRunner />
      </div>
      <Footer />
    </div>
  )
}
