import { useUser } from "@/features/auth/useUser"
import type { CreatableRole, TeamMember } from "@/types/database"
import { useState } from "react"
import { useSetMemberActive } from "./useSetMemberActive"
import { useTeam } from "./useTeam"

export function useTeamMemberList(role: CreatableRole) {
  const { user } = useUser()
  // Only admins manage people; managers see the agent team read-only
  const isAdmin = user?.user_profile?.role === "admin"

  const { team, isLoading, error, refetch } = useTeam(role)
  const { setActive } = useSetMemberActive()
  const [editTarget, setEditTarget] = useState<TeamMember>()

  const members = team ?? []

  return {
    team,
    // Deactivated people get their own section below the active team
    active: members.filter((m) => m.is_active),
    inactive: members.filter((m) => !m.is_active),
    isLoading,
    error,
    refetch,
    isAdmin,
    editTarget,
    openEdit: (member: TeamMember) => setEditTarget(member),
    closeEdit: () => setEditTarget(undefined),
    toggleActive: (member: TeamMember) =>
      setActive({ userId: member.user_id, isActive: !member.is_active }),
  }
}
