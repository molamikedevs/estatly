import BackLink from "@/components/BackLink"
import DisplayField from "@/components/form-components/DisplayField"
import ProfileHeader from "@/features/team/UserHeader"
import ProfileSkeleton from "@/features/team/UserSkeleton"
import type { CreatableRole } from "@/types/database"
import { Briefcase, Mail, Phone, User as UserIcon } from "lucide-react"
import TeamMemberNotFound from "./TeamMemberNotFound"
import { useTeamMember } from "./useTeamMember"

const copy: Record<CreatableRole, { backLabel: string }> = {
  agent: { backLabel: "Go back to agents" },
  manager: { backLabel: "Go back to managers" },
}

export default function TeamMemberProfile({ role }: { role: CreatableRole }) {
  const { member, isLoading, error } = useTeamMember(role)

  if (isLoading) return <ProfileSkeleton />
  if (error || !member) return <TeamMemberNotFound role={role} />

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <BackLink route={`/${role}s`} label={copy[role].backLabel} />

      {/* Shared header — no onEdit, so no Edit button */}
      <ProfileHeader profile={member} />

      {/* About — same DisplayField grid as the Profile page */}
      <div className="rounded-2xl border bg-card p-6 shadow-card sm:p-8">
        <div className="mb-5">
          <h3 className="text-base font-semibold">About</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Contact information and details
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <DisplayField
            icon={UserIcon}
            label="Full name"
            value={member.full_name}
          />
          <DisplayField
            icon={Mail}
            label="Email address"
            value={member.email}
          />
          <DisplayField
            icon={Phone}
            label="Phone number"
            value={member.phone}
          />
          <DisplayField
            icon={Briefcase}
            label="Specialization"
            value={member.specialization}
          />
        </div>

        {member.bio && (
          <div className="mt-4 rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="mb-1.5 text-[10px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
              Bio
            </p>
            <p className="text-sm leading-relaxed text-foreground">
              {member.bio}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
