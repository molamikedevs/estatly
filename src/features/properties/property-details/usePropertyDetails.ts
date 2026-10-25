import type { Property } from "@/types/database"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDeleteProperty } from "../useDeleteProperty"

export function usePropertyDetails(property: Property) {
  const navigate = useNavigate()
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const { deleteProperty, isPending: isDeleting } = useDeleteProperty()

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

  return {
    galleryImages,
    editOpen,
    setEditOpen,
    deleteOpen,
    setDeleteOpen,
    isDeleting,
    handleConfirmDelete,
  }
}
