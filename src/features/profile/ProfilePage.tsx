import ErrorMessage from "@/components/common/ErrorMessage"
import PageHeader from "@/components/common/PageHeader"
import ThemeSwitch from "@/components/theme/ThemeSwitch"
import { Button } from "@/components/ui/button"
import { useLogout } from "@/features/auth/useLogout"
import { useUser } from "@/features/auth/useUser"
import { LogOut } from "lucide-react"
import type { ReactNode } from "react"
import PasswordForm from "./PasswordForm"
import ProfileDetailsForm from "./ProfileDetailsForm"
import ProfileHeader from "./ProfileHeader"

export default function ProfilePage() {
  // Already loaded and cached by ProtectedRoute, so there is no loading state here
  const { user } = useUser()
  const { logout, isPending: isSigningOut } = useLogout()
  const profile = user?.user_profile

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <PageHeader title="Profile" subText="Your details, photo and password" />

      {!user || !profile ? (
        <ErrorMessage error={new Error("Your profile could not be loaded")} />
      ) : (
        <>
          <ProfileHeader
            profile={profile}
            email={user.email ?? profile.email}
            memberSince={user.created_at}
          />

          <ProfileDetailsForm profile={profile} />

          <div className="divide-y rounded-xl border bg-card">
            <PasswordForm />

            <SettingRow
              title="Appearance"
              description="Switch between light and dark mode."
              action={<ThemeSwitch variant="outline" />}
            />

            <SettingRow
              title="Sign out"
              description="End your session on this device."
              action={
                <Button
                  variant="outline"
                  disabled={isSigningOut}
                  onClick={() => logout()}
                >
                  <LogOut />
                  {isSigningOut ? "Signing out…" : "Sign out"}
                </Button>
              }
            />
          </div>
        </>
      )}
    </div>
  )
}

/** One setting: text on the left, its control on the right. */
function SettingRow({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action: ReactNode
}) {
  return (
    <section className="flex items-center justify-between gap-4 p-5 sm:p-6">
      <div className="min-w-0">
        <h2 className="font-medium">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="shrink-0">{action}</div>
    </section>
  )
}
