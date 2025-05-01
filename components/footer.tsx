import { SocialLinks } from "@/components/social-links"

export function Footer() {
  return (
    <footer className="border-t border-purple-300/30 py-6 md:py-0 bg-purple-900/50 backdrop-blur-md relative z-10">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <div className="flex items-center">
          <img
            src="/images/fluent-logo.png"
            alt="Fluent"
            className="h-6 brightness-0 invert"
            style={{ filter: "brightness(0) invert(1)" }}
          />
          <span className="text-sm text-white font-medium ml-2">Daily Attendance. All rights reserved.</span>
        </div>
        <div className="hidden md:flex">
          <SocialLinks />
        </div>
        <p className="text-sm text-white font-medium">Built with ❤️ for Fluent Community</p>
      </div>
    </footer>
  )
}
