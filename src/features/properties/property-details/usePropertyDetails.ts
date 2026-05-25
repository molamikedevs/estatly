import { useProperty } from "@/features/properties/useProperty"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useConfirmDeleteProperty } from "../useConfirmDeleteProperty"

/**
 * Page-level logic for the property details screen: wraps the data
 * fetch (useProperty) and adds modal state, the delete flow, and a few
 * derived display values.
 */
export function usePropertyDetails() {
  const { isLoading, property } = useProperty()
  const navigate = useNavigate()

  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  // On a single-property screen, a successful delete leaves nothing to
  // show — close the dialog and return to the list.
  const { confirmDelete, isDeleting } = useConfirmDeleteProperty(() => {
    setDeleteOpen(false)
    navigate("/properties")
  })

  function handleConfirmDelete() {
    confirmDelete(property?.id?.toString())
  }

  // Fall back to the main image (or nothing) when there's no gallery.
  const galleryImages = property
    ? property.gallery_images?.length > 0
      ? property.gallery_images
      : property.main_image
        ? [property.main_image]
        : []
    : []

  return {
    isLoading,
    property,
    isRent: property?.listing_type === "rent",
    galleryImages,
    editOpen,
    deleteOpen,
    isDeleting,
    setEditOpen,
    setDeleteOpen,
    handleConfirmDelete,
  }
}
