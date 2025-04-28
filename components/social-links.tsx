import Link from "next/link"
import { Twitter } from "lucide-react"
import { DiscordIcon } from "@/components/icons"

export function SocialLinks() {
  return (
    <div className="flex items-center justify-center gap-4 my-4">
      <Link
        href="https://x.com/fluentxyz"
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-white/30 backdrop-blur-sm hover:bg-white/50 transition-colors"
        aria-label="Twitter"
      >
        <Twitter className="h-5 w-5 text-blue-600" />
      </Link>

      <Link
        href="https://discord.gg/fluentxyz"
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-white/30 backdrop-blur-sm hover:bg-white/50 transition-colors"
        aria-label="Discord"
      >
        <DiscordIcon className="h-5 w-5 text-indigo-600" />
      </Link>

      <Link
        href="https://www.fluent.xyz/"
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-white/30 backdrop-blur-sm hover:bg-white/50 transition-colors"
        aria-label="Fluent Website"
      >
        <div className="h-5 w-5 flex items-center justify-center">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fluent%20logo-8jZVkArne5EaPnrapS4L3ykPqXouKo.png"
            alt="Fluent Logo"
            className="h-5 w-5 object-contain"
            style={{ filter: "invert(0.4) sepia(1) saturate(5) hue-rotate(220deg)" }}
          />
        </div>
      </Link>
    </div>
  )
}
