import { Button } from "@/components/ui/button"
import { Building2, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function PropertiesEmptyState({
  filtered,
}: {
  filtered: boolean
}) {
  const navigate = useNavigate()

  return (
    <div className="pattern-dots flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Building2 className="h-7 w-7" />
      </div>
      <h3 className="mt-4 text-base font-semibold">
        {filtered ? "No matching properties" : "No properties yet"}
      </h3>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">
        {filtered
          ? "Try adjusting your filters to see more listings."
          : "Add your first property to start building your portfolio."}
      </p>
      {!filtered && (
        <Button
          onClick={() => navigate("/properties/new")}
          size="sm"
          className="mt-5 gap-2 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add property
        </Button>
      )}
    </div>
  )
}
