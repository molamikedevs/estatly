import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser } from "@/features/auth/useUser"
import { getInitials } from "@/lib/helpers"
import { useNavigate } from "react-router-dom"

export default function ProfileAvatar() {
  const { user, isLoading } = useUser()
  const navigate = useNavigate()

  // — Skeleton placeholder while user loads (prevents blank circle & broken nav) —
  if (isLoading || !user) {
    return (
      <div
        aria-hidden="true"
        className="shimmer relative ml-1 h-9 w-9 shrink-0 overflow-hidden rounded-full"
      />
    )
  }

  const displayName = user?.user_profile?.full_name || user?.email || "User"
  const initials = getInitials(displayName) || "U"
  const avatarUrl = user?.user_profile?.avatar ?? undefined
  const isActive = user?.user_profile?.is_active

  return (
    <button
      className="relative ml-1 cursor-pointer transition-opacity hover:opacity-90"
      aria-label="View account"
      title={displayName}
      onClick={() => navigate(`/profile/${user.id}`)}
    >
      <Avatar className="h-9 w-9">
        <AvatarImage src={avatarUrl} alt={displayName} />
        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-xs font-semibold text-primary-foreground">
          {initials}
        </AvatarFallback>
      </Avatar>
      {isActive && (
        <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full bg-success ring-2 ring-background" />
      )}
    </button>
  )
}
