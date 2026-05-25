import { Button } from "@/components/ui/button"
import { resizeImage } from "@/lib/resizeImage"
import { cn } from "@/lib/utils"
import { ImagePlus, Loader2, Star, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

const HARD_MAX_SIZE = 25 * 1024 * 1024
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"]
const MAX_IMAGES = 10

export interface GalleryImage {
  id: string // stable key
  file?: File // new upload (optimized)
  url: string // blob URL for new, remote URL for existing
}

interface GalleryUploaderProps {
  value: GalleryImage[]
  onChange: (images: GalleryImage[]) => void
}

export default function GalleryUploader({
  value,
  onChange,
}: GalleryUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Revoke blob URLs for new files on unmount
  useEffect(() => {
    return () => {
      value.forEach((img) => {
        if (img.file) URL.revokeObjectURL(img.url)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (fileInputRef.current) fileInputRef.current.value = ""
    if (!files.length) return

    const room = MAX_IMAGES - value.length
    if (room <= 0) {
      toast.error(`You can upload up to ${MAX_IMAGES} images`)
      return
    }

    const accepted = files.slice(0, room)
    if (files.length > room) {
      toast.error(`Only ${room} more image${room === 1 ? "" : "s"} allowed`)
    }

    setIsProcessing(true)
    try {
      const processed: GalleryImage[] = []
      for (const file of accepted) {
        if (!ACCEPTED_TYPES.includes(file.type)) {
          toast.error(`${file.name}: use JPG, PNG or WebP`)
          continue
        }
        if (file.size > HARD_MAX_SIZE) {
          toast.error(`${file.name}: too large to process`)
          continue
        }
        const optimized = await resizeImage(file, { maxSize: 1600 })
        processed.push({
          id: crypto.randomUUID(),
          file: optimized,
          url: URL.createObjectURL(optimized),
        })
      }
      if (processed.length) onChange([...value, ...processed])
    } catch {
      toast.error("Couldn't process one of those images")
    } finally {
      setIsProcessing(false)
    }
  }

  function removeImage(id: string) {
    const target = value.find((img) => img.id === id)
    if (target?.file) URL.revokeObjectURL(target.url)
    onChange(value.filter((img) => img.id !== id))
  }

  function makeCover(id: string) {
    const target = value.find((img) => img.id === id)
    if (!target) return
    onChange([target, ...value.filter((img) => img.id !== id)])
  }

  const atLimit = value.length >= MAX_IMAGES

  return (
    <div className="space-y-3">
      {/* Upload trigger */}
      <div
        className={cn(
          "rounded-xl border border-dashed border-border bg-muted/30 p-4",
          atLimit && "opacity-60"
        )}
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ImagePlus className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">Property images</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              JPG, PNG or WebP — up to {MAX_IMAGES}. First image is the cover.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing || atLimit}
            className="h-8 shrink-0 gap-1.5 text-xs"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Optimizing…
              </>
            ) : (
              <>
                <ImagePlus className="h-3.5 w-3.5" />
                Add images
              </>
            )}
          </Button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          multiple
          className="hidden"
          onChange={handleFiles}
        />
      </div>

      {/* Thumbnails grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
          {value.map((img, index) => (
            <div
              key={img.id}
              className="group relative aspect-[4/3] overflow-hidden rounded-lg border bg-muted"
            >
              <img
                src={img.url}
                alt={`Property image ${index + 1}`}
                className="h-full w-full object-cover"
              />

              {/* Cover badge */}
              {index === 0 && (
                <span className="absolute top-1.5 left-1.5 flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[9px] font-semibold text-primary-foreground">
                  <Star className="h-2.5 w-2.5 fill-current" />
                  Cover
                </span>
              )}

              {/* Hover actions */}
              <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-foreground/50 opacity-0 transition-opacity group-hover:opacity-100">
                {index !== 0 && (
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    onClick={() => makeCover(img.id)}
                    className="h-7 w-7"
                    aria-label="Set as cover"
                  >
                    <Star className="h-3.5 w-3.5" />
                  </Button>
                )}
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  onClick={() => removeImage(img.id)}
                  className="h-7 w-7"
                  aria-label="Remove image"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
