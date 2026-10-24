import CreateButton from "@/components/CreateButton"
import DataRenderer from "@/components/DataRenderer"
import FormSheet from "@/components/form-components/FormSheet"
import PageHeader from "@/components/PageHeader"
import { useUser } from "@/features/auth/useUser"
import { EMPTY_AGENTS, EMPTY_MANAGERS } from "@/lib/states"
import type { CreatableRole, TeamMember } from "@/types/database"
import { useState } from "react"
import TeamMemberCard from "./TeamMemberCard"
import TeamMemberEditForm from "./TeamMemberEditForm"
import TeamMemberForm from "./TeamMemberForm"
import TeamSkeleton from "./TeamSkeleton"
import { useSetMemberActive } from "./useSetMemberActive"
import { useTeam } from "./useTeam"

const COPY = {
  agent: { title: "Agents", empty: EMPTY_AGENTS },
  manager: { title: "Managers", empty: EMPTY_MANAGERS },
}

export default function TeamMemberList({ role }: { role: CreatableRole }) {
  const { user } = useUser()
  // Only admins manage people; managers see the agent team read-only
  const isAdmin = user?.user_profile?.role === "admin"

  const { team, isLoading, error, refetch } = useTeam(role)
  const { setActive } = useSetMemberActive()
  const [editTarget, setEditTarget] = useState<TeamMember>()

  const { title, empty } = COPY[role]

  function renderCards(members: TeamMember[]) {
    return (
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {members.map((member) => (
          <li key={member.user_id}>
            <TeamMemberCard
              member={member}
              canManage={isAdmin}
              onEdit={() => setEditTarget(member)}
              onToggleActive={() =>
                setActive({
                  userId: member.user_id,
                  isActive: !member.is_active,
                })
              }
            />
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title={title}
          subText="Who is on the team and what they are working on"
          count={team?.length ?? 0}
          isLoading={isLoading}
        />

        {isAdmin && (
          <CreateButton
            label={`Add ${role}`}
            title={`Add ${role === "agent" ? "an agent" : "a manager"}`}
            description="They sign in with the email and temporary password you set here."
          >
            {(onClose) => <TeamMemberForm role={role} onClose={onClose} />}
          </CreateButton>
        )}
      </div>

      <DataRenderer
        data={team}
        isLoading={isLoading}
        error={error}
        onRetry={() => refetch()}
        loading={<TeamSkeleton />}
        empty={empty}
        render={(items) => {
          const active = items.filter((m) => m.is_active)
          const inactive = items.filter((m) => !m.is_active)

          return (
            <div className="space-y-8">
              {active.length > 0 && renderCards(active)}

              {inactive.length > 0 && (
                <section className="space-y-3">
                  <h2 className="text-sm font-medium text-muted-foreground">
                    Deactivated · {inactive.length}
                  </h2>
                  {renderCards(inactive)}
                </section>
              )}
            </div>
          )
        }}
      />

      <FormSheet
        open={Boolean(editTarget)}
        onOpenChange={(open) => !open && setEditTarget(undefined)}
        title="Edit details"
        description="Name, phone and specialization."
      >
        {editTarget && (
          <TeamMemberEditForm
            member={editTarget}
            onClose={() => setEditTarget(undefined)}
          />
        )}
      </FormSheet>
    </div>
  )
}
