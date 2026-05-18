import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser } from "@/features/auth/useUser"
import { useNavigate } from "react-router-dom"

export default function ProfileAvatar() {
  const { user } = useUser()
  console.log(user)
  const initials = user?.user_profile?.full_name
    ?.split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase()

  const navigate = useNavigate()

  return (
    <button
      className="relative ml-1 cursor-pointer transition-opacity hover:opacity-90"
      aria-label="Account"
      onClick={() => navigate(`/profile/${user?.id}`)}
    >
      <Avatar className="h-9 w-9">
        <AvatarImage src="" alt="User" />
        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-xs font-semibold text-primary-foreground">
          {initials}
        </AvatarFallback>
      </Avatar>
      <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full bg-success ring-2 ring-background" />
    </button>
  )
}
