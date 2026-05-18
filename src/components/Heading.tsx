import { cn } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot"
import * as React from "react"

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6"

type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> & {
  as?: HeadingLevel
  asChild?: boolean
}

const sizeStyles: Record<HeadingLevel, string> = {
  h1: "text-4xl font-bold tracking-tight md:text-5xl",
  h2: "text-3xl font-semibold tracking-tight md:text-4xl",
  h3: "text-2xl font-semibold tracking-tight",
  h4: "text-xl font-semibold tracking-tight",
  h5: "text-lg font-semibold tracking-tight",
  h6: "text-base font-semibold tracking-tight",
}

export default function Heading({
  as = "h2",
  asChild = false,
  className,
  ...props
}: HeadingProps) {
  const Comp = asChild ? Slot : as
  return (
    <Comp
      className={cn("font-heading text-foreground", sizeStyles[as], className)}
      {...props}
    />
  )
}
