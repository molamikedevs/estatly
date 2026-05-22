import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function AddProperty() {
  const navigate = useNavigate()
  return (
    <Button
      onClick={() => navigate("/properties/new")}
      size="sm"
      className="cursor-pointer gap-2 shadow-sm"
    >
      <Plus className="h-4 w-4" />
      Add property
    </Button>
  )
}
