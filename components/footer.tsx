import { SocialLinks } from "@/components/social-links"

export function Footer() {
  return (
    <footer className="border-t border-purple-300/30 py-6 md:py-0 bg-purple-900/50 backdrop-blur-md relative z-10">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-sm text-white font-medium">
          &copy; {new Date().getFullYear()} Gblend Daily Attendance. All rights reserved.
        </p>
        <div className="hidden md:flex">
          <SocialLinks />
        </div>
        <p className="text-sm text-white font-medium">Built with ❤️ for Fluent</p>
      </div>
    </footer>
  )
}
