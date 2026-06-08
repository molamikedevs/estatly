import { Button } from "@/components/ui/button"
import type { CreatableRole } from "@/types/database"
import { Plus, Users } from "lucide-react"

interface UserEmptyStateProps {
  role: CreatableRole
  canCreate: boolean
  onCreate: () => void
}

const copy: Record<CreatableRole, { noun: string; nounPlural: string }> = {
  agent: { noun: "agent", nounPlural: "agents" },
  manager: { noun: "manager", nounPlural: "managers" },
}

export default function UserEmptyState({
  role,
  canCreate,
  onCreate,
}: UserEmptyStateProps) {
  const { noun, nounPlural } = copy[role]

  return (
    <div className="pattern-dots flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Users className="h-7 w-7" />
      </div>
      <h3 className="mt-4 text-base font-semibold">No {nounPlural} yet</h3>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">
        {canCreate
          ? `Add your first ${noun} to start building your agency team.`
          : `There are no ${nounPlural} on the team yet.`}
      </p>
      {canCreate && (
        <Button onClick={onCreate} size="sm" className="mt-5 gap-2 shadow-sm">
          <Plus className="h-4 w-4" />
          Create {noun}
        </Button>
      )}
    </div>
  )
}
