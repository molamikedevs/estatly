// features/agents/AgentProfile.tsx
import ProfileHeader from "@/features/auth/ProfileHeader"

import BackLink from "@/components/BackLink"
import ProfileSkeleton from "@/features/auth/ProfileSkeleton"
import { Briefcase, Mail, Phone, User as UserIcon } from "lucide-react"
import InfoField from "../auth/InfoField"
import AgentNotFound from "./AgentNotFount"
import { useAgent } from "./useAgent"

export default function AgentProfile() {
  const { agent, isLoading, error } = useAgent()

  if (isLoading) return <ProfileSkeleton />
  if (error || !agent) return <AgentNotFound />

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <BackLink route="/agents" label="Go back to agents" />
      {/* Shared header — no onEdit, so no Edit button */}
      <ProfileHeader profile={agent} />

      {/* About — same InfoField grid as the Profile page */}
      <div className="rounded-2xl border bg-card p-6 shadow-card sm:p-8">
        <div className="mb-5">
          <h3 className="text-base font-semibold">About</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Contact information and details
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoField
            icon={UserIcon}
            label="Full name"
            value={agent.full_name}
          />
          <InfoField icon={Mail} label="Email address" value={agent.email} />
          <InfoField icon={Phone} label="Phone number" value={agent.phone} />
          <InfoField
            icon={Briefcase}
            label="Specialization"
            value={agent.specialization}
          />
        </div>

        {agent.bio && (
          <div className="mt-4 rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="mb-1.5 text-[10px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
              Bio
            </p>
            <p className="text-sm leading-relaxed text-foreground">
              {agent.bio}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
