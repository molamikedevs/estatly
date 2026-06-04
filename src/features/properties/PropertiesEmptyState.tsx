import CreateButton from "@/components/CreateButton"
import { Building2 } from "lucide-react"
import PropertyForm from "./PropertyForm"

export default function PropertiesEmptyState({
  filtered,
}: {
  filtered: boolean
}) {
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
        <div className="mt-5">
          {/* Create flow — CreateButton owns its own open/close state */}

          <CreateButton
            label="Add property"
            size="lg"
            title="Add new property"
            description="Fill in the details to create a new property listing."
          >
            {(onClose) => <PropertyForm onClose={onClose} />}
          </CreateButton>
        </div>
      )}
    </div>
  )
}
