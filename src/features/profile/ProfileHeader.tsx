import UserAvatar from "@/components/common/UserAvatar"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/helpers"
import type { UserProfile } from "@/types/database"
import { Camera } from "lucide-react"
import { useRef } from "react"
import { ACCEPTED_TYPES, useUploadAvatar } from "./useUploadAvatar"

interface ProfileHeaderProps {
  profile: UserProfile
  email: string
  memberSince?: string
}

export default function ProfileHeader({
  profile,
  email,
  memberSince,
}: ProfileHeaderProps) {
  const { selectFile, isProcessing, isBusy } = useUploadAvatar()
  const inputRef = useRef<HTMLInputElement>(null)

  const buttonLabel = isProcessing
    ? "Optimizing..."
    : isBusy
      ? "Uploading..."
      : "Change photo"

  return (
    <section className="flex flex-col gap-5 rounded-xl border bg-card p-5 sm:flex-row sm:items-center sm:p-6">
      <UserAvatar name={profile.full_name} src={profile.avatar} size="xl" />

      <div className="min-w-0 flex-1">
        <h2 className="truncate text-xl font-semibold">{profile.full_name}</h2>
        <p className="truncate text-sm text-muted-foreground">
          <span className="capitalize">{profile.role}</span> · {email}
        </p>
        {memberSince && (
          <p className="text-sm text-muted-foreground">
            Member since {formatDate(memberSince)}
          </p>
        )}
      </div>

      <Button
        type="button"
        variant="outline"
        disabled={isBusy}
        onClick={() => inputRef.current?.click()}
        className="self-start sm:self-center"
      >
        <Camera />
        {buttonLabel}
      </Button>

      {/* Hidden file picker, opened by the button above */}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) => {
          const file = e.target.files?.[0]
          e.target.value = "" // so picking the same file again still works
          if (file) selectFile(file)
        }}
      />
    </section>
  )
}
