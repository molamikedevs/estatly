import ConfirmDelete from "@/components/common/ConfirmDelete"
import FormSheet from "@/components/form-components/FormSheet"
import type { Property } from "@/types/database"
import { useEffect, useRef } from "react"
import PropertyForm from "../PropertyForm"
import { useIncrementPropertyViews } from "../useIncrementPropertyViews"
import PropertyDetailsHeader from "./PropertyDetailsHeader"
import PropertyGallery from "./PropertyGallery"
import PropertySections from "./PropertySections"
import PropertySidebar from "./PropertySidebar"
import { usePropertyDetails } from "./usePropertyDetails"

export default function PropertyDetailsContent({
  property,
}: {
  property: Property
}) {
  const {
    galleryImages,
    editOpen,
    setEditOpen,
    deleteOpen,
    setDeleteOpen,
    isDeleting,
    handleConfirmDelete,
  } = usePropertyDetails(property)

  const { incrementViews } = useIncrementPropertyViews()

  // Count one view per listing opened. The ref stops React StrictMode
  // in development from counting every visit twice.
  const countedId = useRef<number | null>(null)
  useEffect(() => {
    if (countedId.current === property.id) return
    countedId.current = property.id
    incrementViews(property.id)
  }, [property.id, incrementViews])

  return (
    <div className="space-y-6">
      <PropertyGallery images={galleryImages} title={property.title} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0">
          <PropertyDetailsHeader
            property={property}
            onEdit={() => setEditOpen(true)}
            onDelete={() => setDeleteOpen(true)}
          />
          <PropertySections property={property} />
        </div>
        <PropertySidebar property={property} />
      </div>

      <FormSheet
        open={editOpen}
        onOpenChange={setEditOpen}
        size="lg"
        title="Edit property"
        description="Update the listing details below."
      >
        <PropertyForm property={property} onClose={() => setEditOpen(false)} />
      </FormSheet>

      <ConfirmDelete
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        isPending={isDeleting}
        resourceName={property.title}
      />
    </div>
  )
}
