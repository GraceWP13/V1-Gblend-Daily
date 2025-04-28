import { SocialLinks } from "@/components/social-links"

export function Footer() {
  return (
    <footer className="border-t border-white/20 py-6 md:py-0 bg-white/40 backdrop-blur supports-[backdrop-filter]:bg-white/30 relative z-10">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Gblend Daily Attendance. All rights reserved.
        </p>
        <div className="hidden md:flex">
          <SocialLinks />
        </div>
        <p className="text-sm text-muted-foreground">Built with ❤️ for Fluent</p>
      </div>
    </footer>
  )
}
