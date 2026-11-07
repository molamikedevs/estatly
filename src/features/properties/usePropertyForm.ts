import { useCreateProperty } from "@/features/properties/useCreateProperty"
import { useUpdateProperty } from "@/features/properties/useUpdateProperty"
import { propertyFormSchema } from "@/lib/validation"
import type { Property } from "@/types/database"
import type { PropertyFormValues } from "@/types/global"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

const EMPTY_VALUES: PropertyFormValues = {
  title: "",
  description: "",
  listing_type: "rent",
  property_type: "apartment",
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

// Database values (numbers) → form values (strings)
function toFormValues(p: Property): PropertyFormValues {
  return {
    title: p.title,
    description: p.description,
    listing_type: p.listing_type,
    property_type: p.property_type,
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
  property?: Property
  onClose: () => void
}

export function usePropertyForm({ property, onClose }: UsePropertyFormParams) {
  const { updateProperty, isPending: isUpdating } = useUpdateProperty()
  const { createProperty, isPending: isCreating } = useCreateProperty()

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    // Same as every other form: errors after a field is first left
    mode: "onTouched",
    defaultValues: property ? toFormValues(property) : EMPTY_VALUES,
  })

  const onSubmit = form.handleSubmit((values) => {
    if (property) {
      updateProperty({ id: property.id, values }, { onSuccess: onClose })
    } else {
      createProperty(values, { onSuccess: onClose })
    }
  })

  return {
    form,
    isEdit: Boolean(property),
    isPending: isCreating || isUpdating,
    onSubmit,
  }
}
