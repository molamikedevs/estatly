import CreateButton from "@/components/common/CreateButton"
import DataRenderer from "@/components/common/DataRenderer"
import PageHeader from "@/components/common/PageHeader"
import FormSheet from "@/components/form-components/FormSheet"
import { EMPTY_AGENTS, EMPTY_MANAGERS } from "@/lib/states"
import type { CreatableRole, TeamMember } from "@/types/database"
import TeamMemberCard from "./TeamMemberCard"
import TeamMemberCreateForm from "./TeamMemberCreateForm"
import TeamMemberEditForm from "./TeamMemberEditForm"
import TeamSkeleton from "./TeamSkeleton"
import { useTeamMemberList } from "./useTeamMemberList"

// The only differences between /agents and /managers
const COPY = {
  agent: { title: "Agents", empty: EMPTY_AGENTS },
  manager: { title: "Managers", empty: EMPTY_MANAGERS },
}

export default function TeamMemberList({ role }: { role: CreatableRole }) {
  const {
    team,
    active,
    inactive,
    isLoading,
    error,
    refetch,
    isAdmin,
    editTarget,
    openEdit,
    closeEdit,
    toggleActive,
  } = useTeamMemberList(role)

  const { title, empty } = COPY[role]

  function renderCards(members: TeamMember[]) {
    return (
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {members.map((member) => (
          <li key={member.user_id}>
            <TeamMemberCard
              member={member}
              canManage={isAdmin}
              onEdit={() => openEdit(member)}
              onToggleActive={() => toggleActive(member)}
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
            {(onClose) => (
              <TeamMemberCreateForm role={role} onClose={onClose} />
            )}
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
        render={() => (
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
        )}
      />

      <FormSheet
        open={Boolean(editTarget)}
        onOpenChange={(open) => !open && closeEdit()}
        title="Edit details"
        description="Name, phone and specialization."
      >
        {/* Mounts a fresh form per member: useForm reads defaultValues once */}
        {editTarget && (
          <TeamMemberEditForm member={editTarget} onClose={closeEdit} />
        )}
      </FormSheet>
    </div>
  )
}
