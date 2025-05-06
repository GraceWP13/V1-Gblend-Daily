import Link from "next/link"
import { Twitter } from "lucide-react"
import { DiscordIcon } from "@/components/icons"

export function SocialLinks() {
  return (
    <div className="flex items-center justify-center gap-3 sm:gap-4 my-3 sm:my-4">
      <Link
        href="https://x.com/fluentxyz"
        target="_blank"
        rel="noopener noreferrer"
        className="p-1.5 sm:p-2 rounded-full bg-purple-600 hover:bg-purple-700 shadow-md transition-colors"
        aria-label="Twitter"
      >
        <Twitter className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
      </Link>

      <Link
        href="https://discord.gg/fluentxyz"
        target="_blank"
        rel="noopener noreferrer"
        className="p-1.5 sm:p-2 rounded-full bg-purple-600 hover:bg-purple-700 shadow-md transition-colors"
        aria-label="Discord"
      >
        <DiscordIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
      </Link>

      <Link
        href="https://www.fluent.xyz/"
        target="_blank"
        rel="noopener noreferrer"
        className="p-1.5 sm:p-2 rounded-full bg-purple-600 hover:bg-purple-700 shadow-md transition-colors"
        aria-label="Fluent Website"
      >
        <div className="h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fluent%20logo-8jZVkArne5EaPnrapS4L3ykPqXouKo.png"
            alt="Fluent Logo"
            className="h-4 w-4 sm:h-5 sm:w-5 object-contain brightness-0 invert"
          />
        </div>
      </Link>
    </div>
  )
}
