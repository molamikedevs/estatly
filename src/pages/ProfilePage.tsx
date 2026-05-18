import Heading from "@/components/Heading"
import Profile from "@/features/auth/Profile"

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <Heading as="h2" className="text-2xl">
          My Account
        </Heading>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your profile information and account settings
        </p>
      </div>
      <Profile />
    </div>
  )
}
