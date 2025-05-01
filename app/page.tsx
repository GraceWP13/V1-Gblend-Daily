import { WalletConnect } from "@/components/wallet-connect"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SocialLinks } from "@/components/social-links"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col relative z-10">
      <Header />
      <div className="flex-1 container max-w-5xl mx-auto px-4 py-8 flex flex-col items-center justify-center">
        <div className="w-full max-w-md mx-auto text-center space-y-6">
          <div className="bg-purple-900/50 backdrop-blur-md p-6 rounded-lg border border-purple-400/30 shadow-xl">
            <h1 className="text-4xl font-bold tracking-tight text-white">Gblend Daily Attendance 🎨</h1>
            <p className="text-lg text-white font-medium mt-2">
              Connect your wallet, claim your NFT, and mark your daily attendance to show your loyalty to Fluent.
            </p>
          </div>
          <SocialLinks />
          <WalletConnect />
        </div>
      </div>
      <Footer />
    </main>
  )
}
