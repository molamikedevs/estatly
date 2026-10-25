import ConfirmDelete from "@/components/common/ConfirmDelete"
import CreateButton from "@/components/common/CreateButton"
import DataRenderer from "@/components/common/DataRenderer"
import PageHeader from "@/components/common/PageHeader"
import Pagination from "@/components/common/Pagination"
import FormSheet from "@/components/form-components/FormSheet"
import { usePropertiesOperations } from "@/features/properties/usePropertiesOperations"
import { SKELETON_KEYS } from "@/lib/constants"
import { EMPTY_PROPERTIES, EMPTY_PROPERTIES_FILTERED } from "@/lib/states"
import PropertiesOperations from "./PropertiesOperations"
import PropertyCard from "./PropertyCard"
import PropertyCardSkeleton from "./PropertyCardSkeleton"
import PropertyForm from "./PropertyForm"

const GRID = "grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] gap-4"

export default function PropertiesList() {
  const {
    isLoading,
    error,
    refetch,
    properties,
    total,
    isFiltered,
    editProperty,
    editOpen,
    setEditOpen,
    handleEdit,
    deleteTarget,
    setDeleteTarget,
    isDeleting,
    handleConfirmDelete,
  } = usePropertiesOperations()

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Properties"
          subText="Browse and manage your property listings"
          count={total}
          isLoading={isLoading}
        />
        <CreateButton
          label="Add property"
          size="lg"
          title="Add new property"
          description="Fill in the details to create a new property listing."
        >
          {(onClose) => <PropertyForm onClose={onClose} />}
        </CreateButton>
      </div>

      {!isLoading && (total > 0 || isFiltered) && <PropertiesOperations />}

      <DataRenderer
        data={properties}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
        empty={isFiltered ? EMPTY_PROPERTIES_FILTERED : EMPTY_PROPERTIES}
        loading={
          <div className={GRID}>
            {SKELETON_KEYS.map((k) => (
              <PropertyCardSkeleton key={k} />
            ))}
          </div>
        }
        render={(items) => (
          <div className="space-y-10">
            <div className={GRID}>
              {items.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onEdit={handleEdit}
                  onDelete={setDeleteTarget}
                />
              ))}
            </div>
            <Pagination count={total} label="properties" />
          </div>
        )}
      />

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

      <ConfirmDelete
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(undefined)}
        onConfirm={handleConfirmDelete}
        isPending={isDeleting}
        resourceName={deleteTarget?.title}
      />
    </div>
  )
}
