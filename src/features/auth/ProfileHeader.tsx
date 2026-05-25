import RoleBadge from "@/components/RoleBadge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import UserAvatar from "@/components/UserAvatar"
import type { UserProfile } from "@/types/database"
import { BadgeCheck, Mail, Pencil } from "lucide-react"

interface Props {
  profile: UserProfile
  verified?: boolean
  onEdit?: () => void
}

export default function ProfileHeader({ profile, verified, onEdit }: Props) {
  const displayName = profile.full_name || profile.email || "Unnamed user"

  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-card">
      <div className="relative h-32 bg-gradient-to-br from-primary via-primary/85 to-primary/60">
        <div className="spotlight absolute inset-0 opacity-50" />
        <div className="pattern-dots absolute inset-0 opacity-10" />
      </div>

      <div className="px-6 pb-6 sm:px-8">
        <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <UserAvatar
              name={displayName}
              src={profile.avatar}
              size="2xl"
              ring
              className="shadow-elevated ring-4"
            />

            <div className="sm:pb-1">
              <h2 className="text-2xl font-semibold tracking-tight">
                {displayName}
              </h2>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Mail className="h-3.5 w-3.5" />
                {profile.email}
              </p>
            </div>
          </div>

          {/* Edit button only renders if onEdit is provided */}
          {onEdit && (
            <Button
              size="sm"
              className="gap-2 shadow-sm sm:mb-1"
              onClick={onEdit}
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit profile
            </Button>
          )}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          {profile.role && <RoleBadge role={profile.role} />}
          {verified && (
            <Badge className="gap-1 border-0 bg-success-muted text-success hover:bg-success-muted">
              <BadgeCheck className="h-3 w-3" />
              Verified
            </Badge>
          )}
          <Badge
            variant="outline"
            className="gap-1.5 border-border/60 font-normal text-muted-foreground"
          >
            <span className="relative flex h-1.5 w-1.5">
              {profile.is_active && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              )}
              <span
                className={`relative inline-flex h-1.5 w-1.5 rounded-full ${
                  profile.is_active ? "bg-success" : "bg-muted-foreground"
                }`}
              />
            </span>
            {profile.is_active ? "Active" : "Inactive"}
          </Badge>
        </div>
      </div>
    </div>
  )
}
