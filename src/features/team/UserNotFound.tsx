import { Button } from "@/components/ui/button"
import type { CreatableRole } from "@/types/database"
import { UserX } from "lucide-react"
import { Link } from "react-router-dom"

const copy: Record<CreatableRole, { noun: string; backLabel: string }> = {
  agent: { noun: "Agent", backLabel: "Back to agents" },
  manager: { noun: "Manager", backLabel: "Back to managers" },
}

export default function UserNotFound({ role }: { role: CreatableRole }) {
  const { noun, backLabel } = copy[role]

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center justify-center py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <UserX className="h-7 w-7" />
      </div>
      <h2 className="mt-4 text-lg font-semibold">{noun} not found</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        This {noun.toLowerCase()} may have been removed or the link is invalid.
      </p>
      <Button asChild variant="outline" size="sm" className="mt-5">
        <Link to={`/${role}s`}>{backLabel}</Link>
      </Button>
    </div>
  )
}
