import type { Property } from "@/types/database"
import { Sofa } from "lucide-react"

interface PropertyDescriptionProps {
  property: Property
}

export default function PropertyDescription({
  property,
}: PropertyDescriptionProps) {
  return (
    <section className="rounded-2xl border bg-card p-6 shadow-card">
      <h2 className="text-base font-semibold">Description</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {property.description}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
          <Sofa className="h-3.5 w-3.5" />
          {property.furnished ? "Furnished" : "Unfurnished"}
        </span>
      </div>
    </section>
  )
}
