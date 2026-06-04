import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

type FormSheetSize = "sm" | "md" | "lg"

/**
 * Width presets — kept as a small named set so call sites don't pass
 * raw Tailwind classes. Add a new key here if a future sheet needs
 * a different width.
 */
const sizeClasses: Record<FormSheetSize, string> = {
  sm: "sm:max-w-lg", // ~512px — profile edit
  md: "sm:!w-[50vw] sm:!max-w-[680px]", // clients
  lg: "sm:!w-[50vw] sm:!max-w-[720px]", // properties
}

interface FormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  size?: FormSheetSize
  className?: string
  children: ReactNode
}

/**
 * Right-side sheet shell for forms: handles open/close, the header
 * (title + description), and width sizing. The caller renders the
 * form itself as children.
 */
export default function FormSheet({
  open,
  onOpenChange,
  title,
  description,
  size = "sm",
  className,
  children,
}: FormSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={cn(
          "flex w-full flex-col gap-0 p-0",
          sizeClasses[size],
          className
        )}
      >
        <SheetHeader className="border-b px-6 py-5">
          <SheetTitle className="text-lg">{title}</SheetTitle>
          {description && (
            <SheetDescription className="text-xs">
              {description}
            </SheetDescription>
          )}
        </SheetHeader>

        {children}
      </SheetContent>
    </Sheet>
  )
}
