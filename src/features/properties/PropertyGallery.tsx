import { cn } from "@/lib/utils"
import { ImageOff } from "lucide-react"
import { useState } from "react"

export default function PropertyGallery({
  images,
  title,
}: {
  images: string[]
  title: string
}) {
  const [active, setActive] = useState(0)
  const [failed, setFailed] = useState<Set<number>>(new Set())

  const valid = images.filter((_, i) => !failed.has(i))

  if (valid.length === 0) {
    return (
      <div className="flex aspect-[16/7] w-full items-center justify-center rounded-2xl border bg-muted text-muted-foreground">
        <ImageOff className="h-10 w-10" />
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border bg-muted lg:aspect-[16/7]">
        <img
          src={images[active]}
          alt={`${title} — image ${active + 1}`}
          onError={() => setFailed((s) => new Set(s).add(active))}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex scrollbar-thin gap-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                "relative aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                active === i
                  ? "border-primary"
                  : "border-transparent opacity-65 hover:opacity-100"
              )}
            >
              <img
                src={img}
                alt={`Thumbnail ${i + 1}`}
                onError={() => setFailed((s) => new Set(s).add(i))}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
