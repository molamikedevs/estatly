import Pagination from "@/components/Pagination"

import AddProperty from "./AddProperty"
import PropertiesEmptyState from "./PropertiesEmptyState"
import PropertiesOperations from "./PropertiesOperations"
import PropertyCard from "./PropertyCard"
import PropertyCardSkeleton from "./PropertyCardSkeleton"

import ConfirmDelete from "@/components/ConfirmDelete"
import { usePropertiesOperations } from "@/features/properties/usePropertiesOperations"
import type { Property, PropertyStatus } from "@/types/database"
import PropertyFormSheet from "./PropertyFormSheet"
import { useUpdatePropertyStatus } from "./useUpdatePropertyStatus"

export default function PropertiesList() {
  const {
    isFiltered,
    paginatedProperties,
    total,
    isLoading,
    visibleProperties,
    editProperty,
    deleteProperty,
    editOpen,
    isDeleting,
    handleEdit,
    setDeleteProperty,
    setEditOpen,
    handleConfirmDelete,
  } = usePropertiesOperations()

  const { updateStatus } = useUpdatePropertyStatus()

  function handleStatusChange(property: Property, status: PropertyStatus) {
    updateStatus({ id: property.id, status })
  }
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Properties</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse and manage your property listings
            {!isLoading && total > 0 && (
              <span className="tabular"> · {total} total</span>
            )}
          </p>
        </div>
        <AddProperty />
      </div>

      {!isLoading && total > 0 && <PropertiesOperations />}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <PropertyCardSkeleton key={i} />
          ))}
        </div>
      ) : visibleProperties.length === 0 ? (
        <PropertiesEmptyState filtered={isFiltered} />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paginatedProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onEdit={handleEdit}
                onDelete={setDeleteProperty}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>

          <PropertyFormSheet
            open={editOpen}
            onOpenChange={setEditOpen}
            property={editProperty}
          />

          <Pagination count={visibleProperties.length} label="properties" />
        </>
      )}

      {/* Delete confirmation — rendered once, driven by deleteProperty state */}
      <ConfirmDelete
        open={Boolean(deleteProperty)}
        onOpenChange={(open) => !open && setDeleteProperty(undefined)}
        onConfirm={handleConfirmDelete}
        isPending={isDeleting}
        resourceName={deleteProperty?.title}
      />
    </div>
  )
}
