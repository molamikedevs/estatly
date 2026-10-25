import ConfirmDelete from "@/components/common/ConfirmDelete"
import CreateButton from "@/components/common/CreateButton"
import DataRenderer from "@/components/common/DataRenderer"
import PageHeader from "@/components/common/PageHeader"
import Pagination from "@/components/common/Pagination"
import FormSheet from "@/components/form-components/FormSheet"
import { useUser } from "@/features/auth/useUser"
import { EMPTY_VIEWINGS, EMPTY_VIEWINGS_FILTERED } from "@/lib/states"
import { cn } from "@/lib/utils"
import type { Viewing } from "@/types/database"
import { useState } from "react"
import { gridColumns } from "./constant"
import RescheduleForm from "./RescheduleForm"
import { useDeleteViewing } from "./useDeleteViewing"
import { useUpdateViewing } from "./useUpdateViewing"
import { useViewings } from "./useViewings"
import ViewingForm from "./ViewingForm"
import ViewingItem from "./ViewingItem"
import ViewingsOperations from "./ViewingsOperations"
import ViewingsSkeleton from "./ViewingsSkeleton"

export default function ViewingsTable() {
  const { user } = useUser()
  // Agents only see their own viewings, so an Agent column tells them nothing
  const showAgent = user?.user_profile?.role !== "agent"

  const { viewings, count, isLoading, error, refetch, isFiltered } =
    useViewings()
  const { updateViewing } = useUpdateViewing()
  const { isPending: isDeleting, deleteViewing } = useDeleteViewing()

  const [deleteTarget, setDeleteTarget] = useState<Viewing>()
  const [rescheduleTarget, setRescheduleTarget] = useState<Viewing>()

  function handleConfirmDelete() {
    if (!deleteTarget) return
    deleteViewing(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(undefined),
    })
  }

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
              {/* Column labels, desktop only */}
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
                    onStatusChange={(status) =>
                      updateViewing({ id: viewing.id, status })
                    }
                    onReschedule={() => setRescheduleTarget(viewing)}
                    onDelete={() => setDeleteTarget(viewing)}
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
        onOpenChange={(open) => !open && setRescheduleTarget(undefined)}
        title="Reschedule viewing"
        description="Pick a new date, time or duration."
      >
        {rescheduleTarget && (
          <RescheduleForm
            viewing={rescheduleTarget}
            onClose={() => setRescheduleTarget(undefined)}
          />
        )}
      </FormSheet>

      <ConfirmDelete
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(undefined)}
        onConfirm={handleConfirmDelete}
        isPending={isDeleting}
        resourceName="this viewing"
      />
    </div>
  )
}
