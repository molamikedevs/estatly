import { cn } from "@/lib/utils"

// The tile on its own: loader, error screen, anywhere without a link
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={cn("size-9 shrink-0", className)}
    >
      <rect width="64" height="64" rx="16" fill="var(--primary)" />
      <g
        fill="none"
        stroke="var(--primary-foreground)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M44 19 H20 V45 H44" />
        <path d="M20 32 H38" />
      </g>
    </svg>
  )
}
