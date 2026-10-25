import type { Property } from "@/types/database"
import { Check, Sparkles } from "lucide-react"

/** Features and amenities cards, each shown only when it has items. */
export default function PropertySpecs({ property }: { property: Property }) {
  const features = property.features ?? []
  const amenities = property.amenities ?? []

  return (
    <>
      {features.length > 0 && (
        <section className="rounded-2xl border bg-card p-6 shadow-card">
          <h2 className="flex items-center gap-2 text-base font-semibold">
            <Sparkles className="h-4 w-4 text-primary" />
            Features
          </h2>
          <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {features.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Check className="h-4 w-4 shrink-0 text-success" />
                {feature}
              </li>
            ))}
          </ul>
        </section>
      )}

      {amenities.length > 0 && (
        <section className="rounded-2xl border bg-card p-6 shadow-card">
          <h2 className="text-base font-semibold">Amenities</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {amenities.map((amenity) => (
              <span
                key={amenity}
                className="rounded-full border border-border/60 bg-muted/40 px-3 py-1.5 text-xs font-medium"
              >
                {amenity}
              </span>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
