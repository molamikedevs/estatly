import EmptyMessage from "@/components/common/EmptyMessage"
import ConfirmDelete from "@/components/ConfirmDelete"
import CreateButton from "@/components/CreateButton"
import DataRenderer from "@/components/DataRenderer"
import FormSheet from "@/components/form-components/FormSheet"
import PageHeader from "@/components/PageHeader"
import { useUser } from "@/features/auth/useUser"
import { CLIENT_STAGES } from "@/lib/constants"
import { EMPTY_CLIENTS, EMPTY_STAGE } from "@/lib/states"
import { cn } from "@/lib/utils"
import type { Client, ClientStatus } from "@/types/database"
import { useState } from "react"
import ClientCard from "./ClientCard"
import ClientForm from "./ClientForm"
import ClientsSkeleton from "./ClientsSkeleton"
import { useClients } from "./useClients"
import { useDeleteClient } from "./useDeleteClient"
import { useUpdateClient } from "./useUpdateClient"

export default function ClientsTable() {
  const { user } = useUser()
  // Agents only see their own clients, so the agent line tells them nothing
  const showAgent = user?.user_profile?.role !== "agent"

  const { clients, isLoading, error, refetch } = useClients()
  const { updateClient } = useUpdateClient()
  const { isPending: isDeleting, deleteClient } = useDeleteClient()

  const [editTarget, setEditTarget] = useState<Client>()
  const [deleteTarget, setDeleteTarget] = useState<Client>()
  // Phones show one stage at a time
  const [phoneStage, setPhoneStage] = useState<ClientStatus>("active")

  function handleConfirmDelete() {
    if (!deleteTarget) return
    deleteClient(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(undefined),
    })
  }

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Clients"
          subText="Your pipeline, from first contact to closed"
          count={clients?.length ?? 0}
          isLoading={isLoading}
        />

        <CreateButton
          label="Add client"
          size="md"
          title="Add a client"
          description="Contact details and what they are looking for."
        >
          {(onClose) => <ClientForm onClose={onClose} />}
        </CreateButton>
      </div>

      <DataRenderer
        data={clients}
        isLoading={isLoading}
        error={error}
        onRetry={() => refetch()}
        loading={<ClientsSkeleton />}
        empty={EMPTY_CLIENTS}
        render={(items) => (
          <>
            {/* Phone: pick a stage */}
            <div className="scrollbar-hidden -mx-4 flex gap-2 overflow-x-auto px-4 md:hidden">
              {CLIENT_STAGES.map((stage) => {
                const count = items.filter(
                  (c) => c.status === stage.status
                ).length
                const selected = stage.status === phoneStage
                return (
                  <button
                    key={stage.status}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setPhoneStage(stage.status)}
                    className={cn(
                      "flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors active:scale-[0.97]",
                      selected
                        ? "border-transparent bg-primary text-primary-foreground"
                        : "bg-card text-muted-foreground"
                    )}
                  >
                    {stage.label}
                    <span className="tabular-nums">{count}</span>
                  </button>
                )
              })}
            </div>

            {/* Board: 1 column on phones, 2 on tablets, 4 on wide screens.
                items-start: each column ends where its cards end */}
            <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 xl:grid-cols-4">
              {CLIENT_STAGES.map((stage) => {
                const stageClients = items.filter(
                  (c) => c.status === stage.status
                )

                return (
                  <section
                    key={stage.status}
                    aria-label={stage.label}
                    className={cn(
                      "min-w-0 rounded-xl bg-muted/50 p-3",
                      stage.status !== phoneStage && "hidden md:block"
                    )}
                  >
                    <h2 className="mb-3 flex items-center gap-2 px-1 text-sm font-medium">
                      <span
                        aria-hidden="true"
                        className="size-2 rounded-full"
                        style={{ backgroundColor: stage.color }}
                      />
                      {stage.label}
                      <span className="ml-auto text-muted-foreground tabular-nums">
                        {stageClients.length}
                      </span>
                    </h2>

                    {stageClients.length === 0 ? (
                      <EmptyMessage empty={EMPTY_STAGE} compact />
                    ) : (
                      <ul className="space-y-3">
                        {stageClients.map((client) => (
                          <li key={client.id}>
                            <ClientCard
                              client={client}
                              showAgent={showAgent}
                              onEdit={() => setEditTarget(client)}
                              onMove={(status) =>
                                updateClient({ id: client.id, status })
                              }
                              onDelete={() => setDeleteTarget(client)}
                            />
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                )
              })}
            </div>
          </>
        )}
      />

      <FormSheet
        open={Boolean(editTarget)}
        onOpenChange={(open) => !open && setEditTarget(undefined)}
        title="Edit client"
        description="Update contact details and what they are looking for."
        size="md"
      >
        {editTarget && (
          <ClientForm
            client={editTarget}
            onClose={() => setEditTarget(undefined)}
          />
        )}
      </FormSheet>

      <ConfirmDelete
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(undefined)}
        onConfirm={handleConfirmDelete}
        isPending={isDeleting}
        title="Delete this client?"
        description="Only for clients added by mistake. This can't be undone."
      />
    </div>
  )
}
