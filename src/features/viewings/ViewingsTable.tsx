import ConfirmDelete from "@/components/ConfirmDelete"
import Pagination from "@/components/Pagination"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Viewing, ViewingStatus } from "@/types/database"
import { useState } from "react"
import AddViewing from "./AddViewing"
import { useDeleteViewing } from "./useDeleteViewing"
import { useUpdateViewing } from "./useUpdateViewing"
import { useViewingsOperations } from "./useViewingsOperations"
import ViewingRow from "./ViewingRow"
import ViewingRowSkeleton from "./ViewingRowSkeleton"
import ViewingsEmptyState from "./ViewingsEmptyState"
import ViewingsOperations from "./ViewingsOperations"

export default function ViewingsTable() {
  const { updateViewing } = useUpdateViewing()
  const { isPending: isDeleting, deleteViewing } = useDeleteViewing()

  const { isLoading, total, filteredViewings, paginatedViewings } =
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
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Viewings</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Track property viewing appointments
            {!isLoading && total > 0 && (
              <span className="tabular"> · {total} total</span>
            )}
          </p>
        </div>
        <AddViewing />
      </div>

      {/* Filter + sort */}
      {!isLoading && total > 0 && <ViewingsOperations />}

      {/* Content */}
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
      ) : total === 0 ? (
        <ViewingsEmptyState />
      ) : filteredViewings.length === 0 ? (
        <ViewingsEmptyState filtered />
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border bg-card shadow-card">
            <Table className="w-full table-fixed">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[26%]">Property</TableHead>
                  <TableHead className="w-[22%]">Client</TableHead>
                  <TableHead className="w-[18%]">Agent</TableHead>
                  <TableHead className="w-[15%]">Schedule</TableHead>
                  <TableHead className="w-[11%]">Status</TableHead>
                  <TableHead className="w-[8%] pr-4 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedViewings.map((viewing) => (
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

          <Pagination count={filteredViewings.length} label="viewings" />
        </>
      )}

      {/* Delete confirmation */}
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
