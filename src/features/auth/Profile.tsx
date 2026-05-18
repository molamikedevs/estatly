import Spinner from "@/components/spinner"
import { useUser } from "@/features/auth/useUser"
import { Briefcase, Mail, Phone, User as UserIcon } from "lucide-react"
import { useState } from "react"
import InfoField from "./InfoField"

import ProfileActivity from "./ProfileActivity"
import ProfileHeaderCard from "./ProfileHeaderCard"
import UpdateProfileForm from "./UpdateProfileForm"

export default function Profile() {
  const { user, isLoading } = useUser()

  const [isEditOpen, setIsEditOpen] = useState(false)

  if (isLoading) return <Spinner label="Loading your profile" />
  if (!user) return null

  const profile = user.user_profile

  return (
    <>
      <div className="mx-auto w-full max-w-4xl space-y-6">
        {/* ── Header card ───────────────────────────── */}
        <ProfileHeaderCard setIsEditOpen={setIsEditOpen} />

        {/* ── About ─────────────────────────────────── */}
        <div className="rounded-2xl border bg-card p-6 shadow-card sm:p-8">
          <div className="mb-5">
            <h3 className="text-base font-semibold">About</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Personal details and contact information
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InfoField
              icon={UserIcon}
              label="Full name"
              value={profile?.full_name}
            />
            <InfoField
              icon={Mail}
              label="Email address"
              value={profile?.email ?? user.email}
            />
            <InfoField
              icon={Phone}
              label="Phone number"
              value={profile?.phone}
            />
            <InfoField
              icon={Briefcase}
              label="Specialization"
              value={profile?.specialization}
            />
          </div>

          {profile?.bio && (
            <div className="mt-4 rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="mb-1.5 text-[10px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
                Bio
              </p>
              <p className="text-sm leading-relaxed text-foreground">
                {profile.bio}
              </p>
            </div>
          )}
        </div>

        {/* ── Account activity ──────────────────────── */}
        <ProfileActivity />
      </div>
      {/* ── UPdate Profile Form ──────────────────────── */}
      <UpdateProfileForm open={isEditOpen} onOpenChange={setIsEditOpen} />
    </>
  )
}
