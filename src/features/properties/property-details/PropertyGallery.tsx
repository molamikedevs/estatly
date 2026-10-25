import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react"
import { useRef, useState, type KeyboardEvent, type TouchEvent } from "react"

const SWIPE_THRESHOLD = 40

// Light frosted controls that read on any photo, in either theme
const navButton =
  "absolute top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-neutral-900 shadow-md backdrop-blur-sm transition hover:bg-white active:scale-95 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none sm:opacity-0 sm:group-hover/gallery:opacity-100 sm:focus-visible:opacity-100"

export default function PropertyGallery({
  images,
  title,
}: {
  images: string[]
  title: string
}) {
  const [failed, setFailed] = useState<string[]>([])
  const [active, setActive] = useState(0)
  const touchStartX = useRef<number | null>(null)

  // Broken images drop out of both the main view and the thumbnails
  const valid = images.filter((src) => !failed.includes(src))

  if (valid.length === 0) {
    return (
      <div className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-2 rounded-2xl border bg-muted text-muted-foreground lg:aspect-[16/7]">
        <ImageOff className="h-10 w-10" />
        <p className="text-sm">No photos yet</p>
      </div>
    )
  }

  const index = Math.min(active, valid.length - 1)
  const hasMany = valid.length > 1

  function markFailed(src: string) {
    setFailed((list) => (list.includes(src) ? list : [...list, src]))
  }

  function step(direction: 1 | -1) {
    setActive((index + direction + valid.length) % valid.length)
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (!hasMany) return
    if (e.key === "ArrowRight") step(1)
    if (e.key === "ArrowLeft") step(-1)
  }

  function handleTouchStart(e: TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }

  function handleTouchEnd(e: TouchEvent) {
    if (touchStartX.current === null || !hasMany) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(delta) > SWIPE_THRESHOLD) step(delta < 0 ? 1 : -1)
    touchStartX.current = null
  }

  return (
    <div className="space-y-3">
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={`${title} photos`}
        tabIndex={hasMany ? 0 : undefined}
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="group/gallery relative aspect-[16/9] overflow-hidden rounded-2xl border bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none lg:aspect-[16/7]"
      >
        {/* All photos are stacked; the active one fades in */}
        {valid.map((src, i) => (
          <img
            key={`${src}-${i}`}
            src={src}
            alt={
              i === index ? `${title}, photo ${i + 1} of ${valid.length}` : ""
            }
            aria-hidden={i !== index}
            loading={i === 0 ? "eager" : "lazy"}
            onError={() => markFailed(src)}
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out motion-reduce:transition-none",
              i === index ? "opacity-100" : "opacity-0"
            )}
          />
        ))}

        {hasMany && (
          <>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous photo"
              className={cn(navButton, "left-3")}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next photo"
              className={cn(navButton, "right-3")}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <span
              aria-live="polite"
              className="tabular absolute right-3 bottom-3 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm"
            >
              {index + 1} / {valid.length}
            </span>
          </>
        )}
      </div>

      {hasMany && (
        <div className="flex scrollbar-thin gap-2.5 overflow-x-auto p-1">
          {valid.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              className={cn(
                "relative aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-lg ring-2 ring-offset-2 ring-offset-background transition sm:w-28",
                i === index
                  ? "ring-primary"
                  : "opacity-60 ring-transparent hover:opacity-100"
              )}
            >
              <img
                src={src}
                alt=""
                loading="lazy"
                onError={() => markFailed(src)}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
