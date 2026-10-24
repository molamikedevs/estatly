import { cn } from "@/lib/utils"
import BrandMark from "./BrandMark"

// fullScreen: app start and sign-in check. Otherwise: inside the layout, sidebar stays visible.
export default function Loader({
  fullScreen = true,
}: {
  fullScreen?: boolean
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center gap-4",
        fullScreen ? "min-h-svh bg-background" : "min-h-[60svh]"
      )}
    >
      <BrandMark className="size-12 animate-pulse" />
      <span className="text-sm font-medium text-muted-foreground">Loading</span>
    </div>
  )
}
