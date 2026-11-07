import ConfirmDelete from "@/components/common/ConfirmDelete"
import CreateButton from "@/components/common/CreateButton"
import DataRenderer from "@/components/common/DataRenderer"
import PageHeader from "@/components/common/PageHeader"
import Pagination from "@/components/common/Pagination"
import FormSheet from "@/components/form-components/FormSheet"
import { EMPTY_VIEWINGS, EMPTY_VIEWINGS_FILTERED } from "@/lib/states"
import { cn } from "@/lib/utils"
import { gridColumns } from "./gridColumns"
import RescheduleForm from "./RescheduleForm"
import { useViewingsTable } from "./useViewingsTable"
import ViewingForm from "./ViewingForm"
import ViewingItem from "./ViewingItem"
import ViewingsOperations from "./ViewingsOperations"
import ViewingsSkeleton from "./ViewingsSkeleton"

export default function ViewingsTable() {
  const {
    viewings,
    count,
    isLoading,
    error,
    refetch,
    isFiltered,
    showAgent,
    changeStatus,
    rescheduleTarget,
    openReschedule,
    closeReschedule,
    deleteTarget,
    isDeleting,
    openDelete,
    closeDelete,
    confirmDelete,
  } = useViewingsTable()

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Viewings"
          subText="Track property viewing appointments"
          count={count}
          isLoading={isLoading}
        />

        <CreateButton
          label="Schedule viewing"
          title="Schedule a viewing"
          description="Pick the property, the client and a time."
        >
          {(onClose) => <ViewingForm onClose={onClose} />}
        </CreateButton>
      </div>

      {/* Always visible, so a search or filter with no results can be cleared */}
      <ViewingsOperations />

      <DataRenderer
        data={viewings}
        isLoading={isLoading}
        error={error}
        onRetry={() => refetch()}
        loading={<ViewingsSkeleton />}
        empty={isFiltered ? EMPTY_VIEWINGS_FILTERED : EMPTY_VIEWINGS}
        render={(items) => (
          <>
            <div className="overflow-hidden rounded-xl border bg-card">
              {/* Column labels, desktop only. Same grid as the rows */}
              <div
                aria-hidden="true"
                className={cn(
                  "hidden gap-4 border-b px-4 py-2.5 text-xs font-medium text-muted-foreground md:grid",
                  gridColumns(showAgent)
                )}
              >
                <span>When</span>
                <span>Property</span>
                <span>Client</span>
                {showAgent && <span>Agent</span>}
                <span>Status</span>
                <span />
              </div>

              <ul className="divide-y">
                {items.map((viewing) => (
                  <ViewingItem
                    key={viewing.id}
                    viewing={viewing}
                    showAgent={showAgent}
                    onStatusChange={(status) => changeStatus(viewing, status)}
                    onReschedule={() => openReschedule(viewing)}
                    onDelete={() => openDelete(viewing)}
                  />
                ))}
              </ul>
            </div>

            <Pagination count={count} label="viewings" />
          </>
        )}
      />

      <FormSheet
        open={Boolean(rescheduleTarget)}
        onOpenChange={(open) => !open && closeReschedule()}
        title="Reschedule viewing"
        description="Pick a new date, time or duration."
      >
        {/* Mounts a fresh form per viewing: useForm reads defaultValues once */}
        {rescheduleTarget && (
          <RescheduleForm
            viewing={rescheduleTarget}
            onClose={closeReschedule}
          />
        )}
      </FormSheet>

      <ConfirmDelete
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && closeDelete()}
        onConfirm={confirmDelete}
        isPending={isDeleting}
        resourceName="this viewing"
      />
    </div>
  )
}
