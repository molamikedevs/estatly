import BackLink from "@/components/BackLink"
import ConfirmDelete from "@/components/ConfirmDelete"
import FormSheet from "@/components/form-components/FormSheet"
import Spinner from "@/components/Spinner"
import type { Property, PropertyStatus } from "@/types/database"
import { useEffect } from "react"
import PropertyAgentCard from "../PropertyAgentCard"
import PropertyEmptyState from "../PropertyEmptyState"
import PropertyForm from "../PropertyForm"
import { useIncrementPropertyViews } from "../useIncrementPropertyViews"
import { useUpdatePropertyStatus } from "../useUpdatePropertyStatus"
import PropertyDescription from "./PropertyDescription"
import PropertyDetailsHeader from "./PropertyDetailsHeader"
import PropertyGallery from "./PropertyGallery"
import PropertyPriceCard from "./PropertyPriceCard"
import PropertySpecs from "./PropertySpecs"
import PropertyStatsGrid from "./PropertyStatsGrid"
import { usePropertyDetails } from "./usePropertyDetails"

export default function PropertyDetails() {
  const {
    isLoading,
    property,
    isRent,
    galleryImages,
    editOpen,
    setEditOpen,
    deleteOpen,
    setDeleteOpen,
    isDeleting,
    handleConfirmDelete,
  } = usePropertyDetails()

  const { mutate: incrementViews } = useIncrementPropertyViews()

  // Bump view count once when the page mounts
  useEffect(() => {
    if (property?.id) {
      incrementViews(Number(property?.id))
    }
  }, [property?.id, incrementViews])

  const { updateStatus } = useUpdatePropertyStatus()
  if (isLoading) return <Spinner label="Loading property" />
  if (!property) return <PropertyEmptyState />

  function handleStatusChange(property: Property, status: PropertyStatus) {
    updateStatus({ id: property.id, status })
  }

  return (
    <div className="group space-y-6">
      <BackLink route="/properties" label="Back to properties" />

      <PropertyGallery images={galleryImages} title={property.title} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main column */}
        <div className="space-y-6">
          <PropertyDetailsHeader
            property={property}
            onEdit={() => setEditOpen(true)}
            onDelete={() => setDeleteOpen(true)}
            onStatusChange={handleStatusChange}
          />
          <PropertyStatsGrid property={property} />
          <PropertyDescription property={property} />
          <PropertySpecs property={property} />
        </div>

        {/* Sticky sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <PropertyPriceCard property={property} isRent={isRent} />
          <PropertyAgentCard />
        </aside>
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
