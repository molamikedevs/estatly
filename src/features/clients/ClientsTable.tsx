import ConfirmDelete from "@/components/ConfirmDelete"
import CreateButton from "@/components/CreateButton"
import FormSheet from "@/components/form-components/FormSheet"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Client, ClientStatus } from "@/types/database"
import { useState } from "react"
import ClientForm from "./ClientForm"
import ClientRowSkeleton from "./ClientRowSkeleton"
import ClientStatusGroup from "./ClientStatusGroup"
import ClientsEmptyState from "./ClientsEmptyState"
import { useClients } from "./useClients"
import { useDeleteClient } from "./useDeleteClient"
import { useUpdateClientStatus } from "./useUpdateClientStatus"

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
  const [editClient, setEditClient] = useState<Client | undefined>()
  const [editOpen, setEditOpen] = useState(false)
  const { updateStatus } = useUpdateClientStatus()

  const total = clients?.length ?? 0

  function handleConfirmDelete() {
    if (!deleteTarget) return
    deleteClient(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(undefined),
    })
  }

  function handleStatusChange(client: Client, status: ClientStatus) {
    updateStatus({ id: client.id, status })
  }

  function handleEdit(client: Client) {
    setEditClient(client)
    setEditOpen(true)
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

        <CreateButton
          label="Add new client"
          size="md"
          title="Add new client"
          description="Capture the client's details and preferences to start tracking them in your pipeline."
        >
          {(onClose) => <ClientForm onClose={onClose} />}
        </CreateButton>
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
                        onEdit={handleEdit}
                        onStatusChange={handleStatusChange}
                        onDelete={setDeleteTarget}
                      />
                    ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <FormSheet
        open={editOpen}
        onOpenChange={setEditOpen}
        size="md"
        title="Edit client"
        description="Update this client's details below."
      >
        <ClientForm client={editClient} onClose={() => setEditOpen(false)} />
      </FormSheet>

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
