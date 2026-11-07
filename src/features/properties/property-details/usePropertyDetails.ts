import { useSettings } from "@/features/settings/useSettings"
import type { Property } from "@/types/database"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDeleteProperty } from "../useDeleteProperty"

export function usePropertyDetails(property: Property) {
  const navigate = useNavigate()
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const { deleteProperty, isPending: isDeleting } = useDeleteProperty()
  const { settings } = useSettings()

  // Nothing is left to show after a delete, so go back to the list
  function handleConfirmDelete() {
    deleteProperty(property.id, {
      onSuccess: () => {
        setDeleteOpen(false)
        navigate("/properties")
      },
    })
  }

  // Use the gallery, fall back to the main image, or show nothing
  const galleryImages = property.gallery_images?.length
    ? property.gallery_images
    : property.main_image
      ? [property.main_image]
      : []

  // The agency's cut at the rate set in Settings; null until settings load
  const commission = settings
    ? {
        rate: settings.commission_rate,
        amount: Math.round((property.price * settings.commission_rate) / 100),
      }
    : null

  return {
    galleryImages,
    commission,
    editOpen,
    setEditOpen,
    deleteOpen,
    setDeleteOpen,
    isDeleting,
    handleConfirmDelete,
  }
}
