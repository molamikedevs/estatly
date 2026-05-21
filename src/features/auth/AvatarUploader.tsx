import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useAvatar } from "@/hooks/form/useAvatar"
import { getInitials } from "@/lib/helpers"
import { Upload } from "lucide-react"

export default function AvatarUploader() {
  const {
    isBusy,
    isProcessing,
    displayName,
    handleFileChange,
    ACCEPTED_TYPES,
    profile,
    fileInputRef,
  } = useAvatar()

  return (
    <div className="flex items-center gap-4 rounded-xl border border-border/60 bg-muted/30 p-4">
      <Avatar className="h-16 w-16 shadow-sm ring-2 ring-card">
        <AvatarImage src={profile?.avatar ?? undefined} alt={displayName} />
        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-lg font-semibold text-primary-foreground">
          {getInitials(displayName) || "U"}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">Profile photo</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          JPG, PNG or WebP — any size, we'll optimize it for you.
        </p>
        <div className="mt-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isBusy}
            className="h-8 gap-1.5 text-xs"
          >
            <Upload className="h-3.5 w-3.5" />
            {isProcessing
              ? "Optimizing..."
              : isBusy
                ? "Uploading..."
                : "Upload new photo"}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(",")}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>
    </div>
  )
}
