import { cn } from "@/lib/utils"

type SpinnerProps = {
  size?: "xs" | "sm" | "md" | "lg"
  className?: string
  label?: string
}

const sizeMap = {
  xs: "h-3 w-3 border-[1.5px]",
  sm: "h-4 w-4 border-2",
  md: "h-5 w-5 border-2",
  lg: "h-6 w-6 border-[2.5px]",
}

export default function SpinnerMini({
  size = "sm",
  className,
  label = "Loading",
}: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn(
        "inline-block animate-spin rounded-full border-current border-t-transparent",
        sizeMap[size],
        className
      )}
    >
      <span className="sr-only">{label}</span>
    </span>
  )
}
