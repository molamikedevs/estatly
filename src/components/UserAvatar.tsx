import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/helpers"
import { cn } from "@/lib/utils"

const sizeMap = {
  xs: "h-7 w-7 text-[10px]",
  sm: "h-9 w-9 text-xs",
  md: "h-11 w-11 text-sm",
  lg: "h-12 w-12 text-sm",
  xl: "h-16 w-16 text-lg",
  "2xl": "h-24 w-24 text-2xl",
} as const

type AvatarSize = keyof typeof sizeMap

interface UserAvatarProps {
  name?: string | null
  src?: string | null
  size?: AvatarSize
  ring?: boolean
  className?: string
}

export default function UserAvatar({
  name,
  src,
  size = "md",
  ring = false,
  className,
}: UserAvatarProps) {
  const displayName = name?.trim() || "User"

  return (
    <Avatar
      className={cn(sizeMap[size], ring && "ring-2 ring-card", className)}
    >
      <AvatarImage src={src ?? undefined} alt={displayName} />
      <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 font-semibold text-primary-foreground">
        {getInitials(displayName) || "U"}
      </AvatarFallback>
    </Avatar>
  )
}
