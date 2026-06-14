import DisplayField from "@/components/form-components/DisplayField"
import FormSheet from "@/components/form-components/FormSheet"
import { useUser } from "@/features/auth/useUser"
import { Briefcase, Mail, Phone, User as UserIcon } from "lucide-react"
import { useState } from "react"
import UserActivity from "../team/UserActivity"
import ProfileError from "../team/UserError"
import UserHeader from "../team/UserHeader"
import UserSkeleton from "../team/UserSkeleton"
import UpdateUserForm from "./UpdateUserProfileForm"

export default function UserProfile() {
  const { user, isLoading } = useUser()
  const [isEditOpen, setIsEditOpen] = useState(false)

  if (isLoading) return <UserSkeleton />
  if (!user) return <ProfileError />

  const profile = user.user_profile
  if (!profile) return <ProfileError />

  return (
    <>
      <div className="mx-auto w-full max-w-4xl space-y-6">
        {/* ── Header card ───────────────────────────── */}
        <UserHeader
          profile={profile}
          verified={Boolean(user.email_confirmed_at)}
          onEdit={() => setIsEditOpen(true)}
        />

        {/* ── About ─────────────────────────────────── */}
        <div className="rounded-2xl border bg-card p-6 shadow-card sm:p-8">
          <div className="mb-5">
            <h3 className="text-base font-semibold">About</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Personal details and contact information
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <DisplayField
              icon={UserIcon}
              label="Full name"
              value={profile?.full_name}
            />
            <DisplayField
              icon={Mail}
              label="Email address"
              value={profile?.email ?? user.email}
            />
            <DisplayField
              icon={Phone}
              label="Phone number"
              value={profile?.phone}
            />
            <DisplayField
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
        <UserActivity />
      </div>

      {/* ── Update Profile Form ───────────────────────── */}
      <FormSheet
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        size="sm"
        title="Edit profile"
        description="Update your profile details below."
      >
        <UpdateUserForm
          open={isEditOpen}
          onClose={() => setIsEditOpen(false)}
        />
      </FormSheet>
    </>
  )
}
