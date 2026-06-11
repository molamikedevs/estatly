import Pagination from "@/components/Pagination"

import PropertiesEmptyState from "./PropertiesEmptyState"
import PropertiesOperations from "./PropertiesOperations"
import PropertyCard from "./PropertyCard"
import PropertyCardSkeleton from "./PropertyCardSkeleton"

import ConfirmDelete from "@/components/ConfirmDelete"
import CreateButton from "@/components/CreateButton"
import FormSheet from "@/components/form-components/FormSheet"
import { usePropertiesOperations } from "@/features/properties/usePropertiesOperations"
import { SKELETON_KEYS } from "@/lib/constants"
import type { Property, PropertyStatus } from "@/types/database"
import PropertyForm from "./PropertyForm"
import { useUpdatePropertyStatus } from "./useUpdatePropertyStatus"

export default function PropertiesList() {
  const {
    isFiltered,
    properties,
    total,
    isLoading,
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
              <span className="tabular-nums"> · {total} total</span>
            )}
          </p>
        </div>

        {/* Create flow — CreateButton owns its own open/close state */}
        <CreateButton
          label="Add property"
          size="lg"
          title="Add new property"
          description="Fill in the details to create a new property listing."
        >
          {(onClose) => <PropertyForm onClose={onClose} />}
        </CreateButton>
      </div>

      {!isLoading && total > 0 && <PropertiesOperations />}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {SKELETON_KEYS.map((k) => (
            <PropertyCardSkeleton key={k} />
          ))}
        </div>
      ) : total === 0 ? (
        <PropertiesEmptyState filtered={isFiltered} />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onEdit={handleEdit}
                onDelete={setDeleteProperty}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>

          {/* Edit flow — open state owned by usePropertiesOperations */}

          <FormSheet
            open={editOpen}
            onOpenChange={setEditOpen}
            size="lg"
            title="Edit property"
            description="Update the listing details below."
          >
            <PropertyForm
              property={editProperty}
              onClose={() => setEditOpen(false)}
            />
          </FormSheet>

          <Pagination count={total} label="properties" />
        </>
      )}

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
