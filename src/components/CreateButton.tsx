import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState, type ReactNode } from "react"
import FormSheet from "./form-components/FormSheet"

type CreateButtonSize = "sm" | "md" | "lg"

interface CreateButtonProps {
  /** Text on the trigger button. */
  label: string
  /** Title shown in the sheet header. */
  title: string
  /** Description shown in the sheet header. */
  description?: string
  /** Width preset for the sheet (forwarded to FormSheet). */
  size?: CreateButtonSize
  /**
   * The form to render inside the sheet. Receives an onClose callback
   * the form can call after a successful submit.
   */
  children: (onClose: () => void) => ReactNode
}

/**
 * A trigger button paired with a FormSheet. Owns the open/close state
 * so callers only have to describe what the sheet contains.
 */
export default function CreateButton({
  label,
  title,
  description,
  size,
  children,
}: CreateButtonProps) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <>
      <Button onClick={() => setOpen(true)} className="gap-2 shadow-sm">
        <Plus className="h-4 w-4" />
        {label}
      </Button>

      <FormSheet
        open={open}
        onOpenChange={setOpen}
        title={title}
        description={description}
        size={size}
      >
        {children(close)}
      </FormSheet>
    </>
  )
}
