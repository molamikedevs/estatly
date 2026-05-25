import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import PropertyFormSheet from "./PropertyFormSheet"

export default function AddProperty() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        size="sm"
        className="cursor-pointer gap-2 shadow-sm"
      >
        <Plus className="h-4 w-4" />
        Add property
      </Button>

      <PropertyFormSheet open={open} onOpenChange={setOpen} />
    </>
  )
}
