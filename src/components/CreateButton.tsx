import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"

interface CreateButtonProps {
  label: string
  /** Renders the sheet/dialog. Receives the open state + setter. */
  renderSheet: (props: {
    open: boolean
    onOpenChange: (open: boolean) => void
  }) => React.ReactNode
}

export default function CreateButton({
  label,
  renderSheet,
}: CreateButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        size="sm"
        className="cursor-pointer gap-2 shadow-sm"
      >
        <Plus className="h-4 w-4" />
        {label}
      </Button>

      {renderSheet({ open, onOpenChange: setOpen })}
    </>
  )
}
