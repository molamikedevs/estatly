import FormSheet from "@/components/form-components/FormSheet"
import { Button } from "@/components/ui/button"
import { useUser } from "@/features/auth/useUser"
import UserForm from "@/features/team/TeamMemberForm"
import type { CreatableRole } from "@/types/database"
import { Plus } from "lucide-react"
import { useState } from "react"
import TeamMemberCard from "./TeamMemberCard"
import TeamMemberEmptyState from "./TeamMemberEmptyState"
import UserCardSkeleton from "./UserCardSkeleton"
import { useUsers } from "./useUsers"

interface UserListProps {
  role: CreatableRole
}

const copy: Record<CreatableRole, { heading: string; noun: string }> = {
  agent: { heading: "Agents", noun: "agent" },
  manager: { heading: "Managers", noun: "manager" },
}

export default function TeamMemberList({ role }: UserListProps) {
  const [createOpen, setCreateOpen] = useState(false)
  const { users, isLoading } = useUsers(role)
  const { user } = useUser()

  const currentRole = user?.user_profile?.role
  const canCreate = currentRole === "admin" || currentRole === "manager"
  const hasusers = !isLoading && users && users.length > 0

  const { heading, noun } = copy[role]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{heading}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your agency team and their access
            {hasusers && (
              <span className="tabular-nums"> · {users.length} total</span>
            )}
          </p>
        </div>

        {canCreate && hasusers && (
          <Button
            onClick={() => setCreateOpen(true)}
            className="gap-2 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Create {noun}
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <UserCardSkeleton key={i} />
          ))}
        </div>
      ) : !hasusers ? (
        <TeamMemberEmptyState
          role={role}
          canCreate={canCreate}
          onCreate={() => setCreateOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((member) => (
            <TeamMemberCard key={member.user_id} member={member} role={role} />
          ))}
        </div>
      )}

      <FormSheet
        open={createOpen}
        onOpenChange={setCreateOpen}
        title={`Create new ${noun}`}
        description={`The ${noun} will receive sign-in credentials and can immediately access the platform.`}
      >
        <UserForm role={role} onClose={() => setCreateOpen(false)} />
      </FormSheet>
    </div>
  )
}
