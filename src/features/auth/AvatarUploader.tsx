import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { getInitials } from "@/lib/helpers"
import { Trash2, Upload } from "lucide-react"
import { useRef } from "react"

const MAX_AVATAR_SIZE = 2 * 1024 * 1024 // 2 MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"]

export interface AvatarUploaderProps {
  /** URL to display (preview blob or existing avatar). null = show fallback. */
  src: string | null
  /** Display name used for the fallback initials. */
  displayName: string
  /** Validation / file error message to show below the uploader. */
  error: string | null
  /** Whether the existing avatar has been marked for removal. */
  removing: boolean
  /** Called with the validated File when the user picks one. */
  onFileChange: (file: File) => void
  /** Called when the user clicks "Remove". */
  onRemove: () => void
}

export function AvatarUploader({
  src,
  displayName,
  error,
  removing,
  onFileChange,
  onRemove,
}: AvatarUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    // Validation is intentionally kept here so the parent stays thin.
    if (!ACCEPTED_TYPES.includes(file.type)) return
    if (file.size > MAX_AVATAR_SIZE) return
    onFileChange(file)
  }

  const showRemoveBtn = src !== null && !removing

  return (
    <div>
      <div className="flex items-center gap-4 rounded-xl border border-border/60 bg-muted/30 p-4">
        <Avatar className="h-16 w-16 shadow-sm ring-2 ring-card">
          <AvatarImage src={src ?? undefined} alt={displayName} />
          <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-lg font-semibold text-primary-foreground">
            {getInitials(displayName) || "U"}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">Profile photo</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            JPG, PNG or WebP · Max 2 MB
          </p>

          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-3.5 w-3.5" />
              Upload
            </Button>

            {showRemoveBtn && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={onRemove}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </Button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(",")}
            className="hidden"
            onChange={handleChange}
          />
        </div>
      </div>

      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
    </div>
  )
}
