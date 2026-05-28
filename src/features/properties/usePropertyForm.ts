import { useCreateProperty } from "@/features/properties/useCreateProperty"
import { useUpdateProperty } from "@/features/properties/useUpdateProperty"
import { propertySchema } from "@/lib/validation"
import type { Property } from "@/types/database"
import type { PropertyFormValues } from "@/types/global"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
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
function propertyToFormValues(p: Property): PropertyFormValues {
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
  property?: Property
  onClose: () => void
}

export function usePropertyForm({ property, onClose }: UsePropertyFormParams) {
  const isEdit = Boolean(property)

  const { updateProperty, isPending: isUpdating } = useUpdateProperty()
  const { createProperty, isPending: isCreating } = useCreateProperty()
  const isPending = isEdit ? isUpdating : isCreating

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    mode: "onBlur",
    defaultValues: property ? propertyToFormValues(property) : EMPTY_VALUES,
  })

  const { reset, handleSubmit } = form

  useEffect(() => {
    reset(property ? propertyToFormValues(property) : EMPTY_VALUES)
  }, [property, reset])

  const onSubmit = handleSubmit((values) => {
    // values are PropertyFormValues (strings). The API converts to numbers.
    if (isEdit && property) {
      updateProperty(
        { newProperty: values, id: String(property.id) },
        { onSuccess: onClose }
      )
    } else {
      createProperty(values, { onSuccess: onClose })
    }
  })

  return { form, isEdit, isPending, onSubmit }
}
