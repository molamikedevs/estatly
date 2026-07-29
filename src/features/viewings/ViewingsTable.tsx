import ConfirmDelete from "@/components/ConfirmDelete"
import CreateButton from "@/components/CreateButton"
import DataRenderer from "@/components/data-renderer"
import PageHeader from "@/components/page-header"
import Pagination from "@/components/Pagination"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { EMPTY_VIEWINGS, EMPTY_VIEWINGS_FILTERED } from "@/lib/constants"
import type { Viewing, ViewingStatus } from "@/types/database"
import { useState } from "react"
import { useDeleteViewing } from "./useDeleteViewing"
import { useUpdateViewing } from "./useUpdateViewing"
import { useViewingsOperations } from "./useViewingsOperations"
import ViewingForm from "./ViewingForm"
import ViewingRow from "./ViewingRow"
import ViewingRowSkeleton from "./ViewingRowSkeleton"
import ViewingsOperations from "./ViewingsOperations"

export default function ViewingsTable() {
  const { updateViewing } = useUpdateViewing()
  const { isPending: isDeleting, deleteViewing } = useDeleteViewing()

  const { isLoading, success, error, count, viewings, isFiltered } =
    useViewingsOperations()

  const [deleteTarget, setDeleteTarget] = useState<Viewing | undefined>()

  function handleStatusChange(viewing: Viewing, status: ViewingStatus) {
    updateViewing({ id: viewing.id, status })
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return
    deleteViewing(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(undefined),
    })
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          count={count}
          isLoading={isLoading}
          heading="Viewings"
          subText="Track property viewing appointments"
        />

        <CreateButton
          label="Schedule viewing"
          title="Schedule new viewing"
          description="Book a property viewing by filling in the details below."
        >
          {(onClose) => <ViewingForm onClose={onClose} />}
        </CreateButton>
      </div>

      {/* Filter + sort */}
      {!isLoading && count > 0 && <ViewingsOperations />}

      {/* Loading stays OUTSIDE DataRenderer */}
      {isLoading ? (
        <div className="overflow-hidden rounded-2xl border bg-card shadow-card">
          <Table className="w-full table-fixed">
            <TableBody>
              {Array.from({ length: 6 }).map((_, i) => (
                <ViewingRowSkeleton key={i} />
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <DataRenderer
          success={success}
          error={error}
          data={viewings}
          empty={isFiltered ? EMPTY_VIEWINGS_FILTERED : EMPTY_VIEWINGS}
          render={(viewings) => (
            <>
              <div className="overflow-hidden rounded-2xl border bg-card shadow-card">
                <div className="scrollbar-thin overflow-x-auto md:overflow-x-visible">
                  <Table className="w-full min-w-[760px] md:min-w-0 md:table-fixed">
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="min-w-[200px] md:w-[26%] md:min-w-0">
                          Property
                        </TableHead>
                        <TableHead className="min-w-[160px] md:w-[22%] md:min-w-0">
                          Client
                        </TableHead>
                        <TableHead className="min-w-[140px] md:w-[18%] md:min-w-0">
                          Agent
                        </TableHead>
                        <TableHead className="min-w-[120px] md:w-[15%] md:min-w-0">
                          Schedule
                        </TableHead>
                        <TableHead className="min-w-[100px] md:w-[11%] md:min-w-0">
                          Status
                        </TableHead>
                        <TableHead className="w-[56px] pr-4 text-right md:w-[8%]">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {viewings.map((viewing) => (
                        <ViewingRow
                          key={viewing.id}
                          viewing={viewing}
                          onStatusChange={handleStatusChange}
                          onDelete={setDeleteTarget}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <Pagination count={count} label="viewings" />
            </>
          )}
        />
      )}

      {/* Delete confirmation — outside all states */}
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
