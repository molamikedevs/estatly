import { useSaveProperty } from "@/features/properties/useSaveProperty"
import { CreatePropertySchema } from "@/lib/validation"
import type { PropertyParams } from "@/types/database"
import type { PropertyFormValues } from "@/types/global"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

const EMPTY_VALUES: PropertyFormValues = {
  title: "",
  description: "",
  listing_type: "rent",
  property_type: "apartment",
  status: "pending-approval",
  price: "",
  bedrooms: "",
  bathrooms: "",
  size_sqm: "",
  year_built: "",
  gallery_images: [],
  city: "",
  neighborhood: "",
  address: "",
  furnished: false,
  features: [],
  amenities: [],
}

// Existing property (numbers) -> form values (strings) for editing
function propertyToFormValues(p: PropertyParams): PropertyFormValues {
  return {
    title: p.title,
    description: p.description,
    listing_type: p.listing_type,
    property_type: p.property_type,
    status: p.status,
    price: String(p.price),
    bedrooms: String(p.bedrooms),
    bathrooms: String(p.bathrooms),
    size_sqm: String(p.size_sqm),
    year_built: p.year_built ? new Date(p.year_built, 0, 1).toISOString() : "",
    gallery_images: (p.gallery_images ?? []).map((url) => ({
      id: crypto.randomUUID(),
      url,
    })),
    city: p.city,
    neighborhood: p.neighborhood,
    address: p.address,
    furnished: p.furnished,
    features: p.features ?? [],
    amenities: p.amenities ?? [],
  }
}

interface UsePropertyFormParams {
  property?: PropertyParams
  onClose: () => void
}

export function usePropertyForm({ property, onClose }: UsePropertyFormParams) {
  const isEdit = Boolean(property)
  const { saveProperty, isPending } = useSaveProperty(isEdit)

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(CreatePropertySchema),
    mode: "onBlur",
    defaultValues: property ? propertyToFormValues(property) : EMPTY_VALUES,
  })

  const onSubmit = form.handleSubmit((values) => {
    const payload =
      isEdit && property ? { ...values, id: String(property.id) } : values
    saveProperty(payload, { onSuccess: onClose })
  })

  return { form, isEdit, isPending, onSubmit }
}
