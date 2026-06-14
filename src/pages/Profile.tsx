import Heading from "@/components/Heading"
import UserProfile from "@/features/auth/UserProfile"

export default function Profile() {
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
      <UserProfile />
    </div>
  )
}
