import ConfirmDelete from "@/components/common/ConfirmDelete"
import CreateButton from "@/components/common/CreateButton"
import DataRenderer from "@/components/common/DataRenderer"
import EmptyMessage from "@/components/common/EmptyMessage"
import PageHeader from "@/components/common/PageHeader"
import FormSheet from "@/components/form-components/FormSheet"
import { EMPTY_CLIENTS, EMPTY_STAGE } from "@/lib/states"
import { cn } from "@/lib/utils"
import ClientCard from "./ClientCard"
import ClientForm from "./ClientForm"
import ClientsSkeleton from "./ClientsSkeleton"
import { useClientsBoard } from "./useClientsBoard"

export default function ClientsBoard() {
  const {
    clients,
    stages,
    isLoading,
    error,
    refetch,
    showAgent,
    phoneStage,
    setPhoneStage,
    moveClient,
    editTarget,
    openEdit,
    closeEdit,
    deleteTarget,
    isDeleting,
    openDelete,
    closeDelete,
    confirmDelete,
  } = useClientsBoard()

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

      {/* DataRenderer handles loading, error and empty from the flat list;
          the board itself renders the grouped stages */}
      <DataRenderer
        data={clients}
        isLoading={isLoading}
        error={error}
        onRetry={() => refetch()}
        loading={<ClientsSkeleton />}
        empty={EMPTY_CLIENTS}
        render={() => (
          <>
            {/* Phone: pick a stage. A 2x2 grid keeps all four visible */}
            <div className="grid grid-cols-2 gap-2 md:hidden">
              {stages.map((stage) => {
                const selected = stage.status === phoneStage
                return (
                  <button
                    key={stage.status}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setPhoneStage(stage.status)}
                    className={cn(
                      "flex h-10 min-w-0 items-center justify-between gap-2 rounded-full border px-4 text-sm font-medium transition-colors active:scale-[0.97]",
                      selected
                        ? "border-transparent bg-primary text-primary-foreground"
                        : "bg-card text-muted-foreground"
                    )}
                  >
                    <span className="truncate">{stage.label}</span>
                    <span className="tabular-nums">{stage.clients.length}</span>
                  </button>
                )
              })}
            </div>

            {/* Board: 1 column on phones, 2 on tablets, 4 on wide screens.
                items-start: each column ends where its cards end */}
            <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 xl:grid-cols-4">
              {stages.map((stage) => (
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
                      {stage.clients.length}
                    </span>
                  </h2>

                  {stage.clients.length === 0 ? (
                    <EmptyMessage empty={EMPTY_STAGE} compact />
                  ) : (
                    <ul className="space-y-3">
                      {stage.clients.map((client) => (
                        <li key={client.id}>
                          <ClientCard
                            client={client}
                            showAgent={showAgent}
                            onEdit={() => openEdit(client)}
                            onMove={(status) =>
                              moveClient({ id: client.id, status })
                            }
                            onDelete={() => openDelete(client)}
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>
          </>
        )}
      />

      <FormSheet
        open={Boolean(editTarget)}
        onOpenChange={(open) => !open && closeEdit()}
        title="Edit client"
        description="Update contact details and what they are looking for."
        size="md"
      >
        {/* Mounts a fresh form per client: useForm reads defaultValues once */}
        {editTarget && <ClientForm client={editTarget} onClose={closeEdit} />}
      </FormSheet>

      <ConfirmDelete
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && closeDelete()}
        onConfirm={confirmDelete}
        isPending={isDeleting}
        title="Delete this client?"
        description="Only for clients added by mistake. This can't be undone."
      />
    </div>
  )
}
