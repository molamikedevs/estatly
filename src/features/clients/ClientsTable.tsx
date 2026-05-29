import ConfirmDelete from "@/components/ConfirmDelete"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Client, ClientStatus } from "@/types/database"
import { useState } from "react"
import AddClient from "./AddClient"
import ClientRowSkeleton from "./ClientRowSkeleton"
import ClientStatusGroup from "./ClientStatusGroup"
import ClientsEmptyState from "./ClientsEmptyState"
import { useClients } from "./useClients"
import { useDeleteClient } from "./useDeleteClient"
import { useUpdateClient } from "./useUpdateClient"

// Pipeline order — active first, dead last
const STATUS_ORDER: ClientStatus[] = [
  "active",
  "closed-won",
  "closed-lost",
  "inactive",
]

export default function ClientsTable() {
  const { isLoading, clients } = useClients()
  const { isPending: isDeleting, deleteClient } = useDeleteClient()
  const [deleteTarget, setDeleteTarget] = useState<Client | undefined>()
  const { updateClient } = useUpdateClient()

  const total = clients?.length ?? 0

  function handleConfirmDelete() {
    if (!deleteTarget) return
    deleteClient(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(undefined),
    })
  }

  function handleStatusChange(client: Client, status: ClientStatus) {
    updateClient({ id: client.id, status })
  }

  // Highest budget_max across all clients — scales every budget bar
  const budgetCeiling =
    clients?.reduce((max, c) => Math.max(max, c.budget_max ?? 0), 0) ?? 0

  // Group clients by status
  const grouped = (clients ?? []).reduce(
    (acc, client) => {
      ;(acc[client.status] ??= []).push(client)
      return acc
    },
    {} as Record<ClientStatus, typeof clients>
  )

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Clients</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your client pipeline
            {!isLoading && total > 0 && (
              <span className="tabular"> · {total} total</span>
            )}
          </p>
        </div>
        <AddClient />
      </div>

      {/* Content */}
      {!isLoading && total === 0 ? (
        <ClientsEmptyState />
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-card shadow-card">
          <div className="scrollbar-thin overflow-x-auto md:overflow-x-visible">
            <Table className="w-full min-w-[760px] md:min-w-0 md:table-fixed">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="min-w-[180px] md:w-[24%] md:min-w-0">
                    Client
                  </TableHead>
                  <TableHead className="min-w-[200px] md:w-[28%] md:min-w-0">
                    Contact
                  </TableHead>
                  <TableHead className="min-w-[160px] md:w-[22%] md:min-w-0">
                    Budget
                  </TableHead>
                  <TableHead className="min-w-[160px] md:w-[20%] md:min-w-0">
                    Assigned agent
                  </TableHead>
                  <TableHead className="w-[56px] pr-4 text-right md:w-[8%]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <ClientRowSkeleton key={i} />
                    ))
                  : STATUS_ORDER.map((status) => (
                      <ClientStatusGroup
                        key={status}
                        status={status}
                        clients={grouped[status] ?? []}
                        budgetCeiling={budgetCeiling}
                        onStatusChange={handleStatusChange}
                        onDelete={setDeleteTarget}
                      />
                    ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <ConfirmDelete
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(undefined)}
        onConfirm={handleConfirmDelete}
        isPending={isDeleting}
        title="Delete this client?"
        description="This will also delete all viewings scheduled for this client. This action can't be undone."
      />
    </div>
  )
}
