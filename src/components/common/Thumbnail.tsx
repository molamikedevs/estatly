import { ImageOff } from "lucide-react"
import { useState } from "react"

export default function Thumbnail({ src }: { src: string | null }) {
  const [failed, setFailed] = useState(false)

  return (
    <div className="size-11 shrink-0 overflow-hidden rounded-md bg-muted">
      {src && !failed ? (
        <img
          src={src}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
          className="size-full object-cover"
        />
      ) : (
        <div className="flex size-full items-center justify-center text-muted-foreground">
          <ImageOff className="size-4" />
        </div>
      )}
    </div>
  )
}
