import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function AddProperty() {
  return (
    <Button size="sm" className="gap-1.5 shadow-sm">
      <Plus className="h-4 w-4" />
      <span className="hidden cursor-pointer sm:inline">New Property</span>
    </Button>
  )
}
