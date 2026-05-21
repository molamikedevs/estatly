import { Button } from "@/components/ui/button"
import { Plus, Users } from "lucide-react"

interface AgentsEmptyStateProps {
  isAdmin: boolean
  onCreate: () => void
}

export default function AgentsEmptyState({
  isAdmin,
  onCreate,
}: AgentsEmptyStateProps) {
  return (
    <div className="pattern-dots flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Users className="h-7 w-7" />
      </div>
      <h3 className="mt-4 text-base font-semibold">No agents yet</h3>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">
        {isAdmin
          ? "Add your first agent to start building your agency team."
          : "There are no agents on the team yet."}
      </p>
      {isAdmin && (
        <Button onClick={onCreate} size="sm" className="mt-5 gap-2 shadow-sm">
          <Plus className="h-4 w-4" />
          Create agent
        </Button>
      )}
    </div>
  )
}
