import type { Property } from "@/types/database"
import { Check } from "lucide-react"
import type { ReactNode } from "react"

export default function PropertySections({ property }: { property: Property }) {
  const features = property.features ?? []
  const amenities = property.amenities ?? []

  return (
    <div className="divide-y divide-border/60">
      <Section title="About this property">
        <p className="max-w-prose text-[15px] leading-7 whitespace-pre-line text-muted-foreground">
          {property.description}
        </p>
      </Section>

      {features.length > 0 && (
        <Section title="Features">
          <CheckList items={features} />
        </Section>
      )}

      {amenities.length > 0 && (
        <Section title="Building amenities">
          <CheckList items={amenities} />
        </Section>
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="py-8">
      <h2 className="font-heading text-lg font-semibold">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-2.5 text-[15px]">
          <Check aria-hidden className="h-4 w-4 shrink-0 text-success" />
          {item}
        </li>
      ))}
    </ul>
  )
}
