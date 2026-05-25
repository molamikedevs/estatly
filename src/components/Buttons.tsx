import { Pencil, Trash2 } from "lucide-react"
import { Button } from "./ui/button"

interface ButtonsProps {
  onEdit: () => void
  onDelete: () => void
}

export default function Buttons({ onEdit, onDelete }: ButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={onEdit}>
        <Pencil className="h-3.5 w-3.5" />
        Edit
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onDelete}
        className="text-destructive hover:text-destructive"
      >
        <Trash2 className="h-3.5 w-3.5" />
        Delete
      </Button>
    </div>
  )
}
