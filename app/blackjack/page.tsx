import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BlackjackGame } from "@/components/blackjack-game"

export default function BlackjackPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 container py-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">Tectra Blackjack</h1>
        <p className="text-center mb-8 text-purple-100 max-w-2xl mx-auto">
          Test your luck with Tectra Blackjack! Use your collected coins from Tectra Runner to place bets and try to
          beat the dealer.
        </p>
        <BlackjackGame />
      </div>
      <Footer />
    </div>
  )
}
