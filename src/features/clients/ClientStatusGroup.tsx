import { TableCell, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import type { Client, ClientStatus } from "@/types/database"
import { ChevronDown } from "lucide-react"
import { useState } from "react"
import ClientRow from "./ClientRow"
import ClientStatusBadge from "./ClientStatusBadge"

interface ClientStatusGroupProps {
  status: ClientStatus
  clients: Client[]
  budgetCeiling: number
  onDelete?: (client: Client) => void
  onStatusChange: (client: Client, status: ClientStatus) => void
}

export default function ClientStatusGroup({
  status,
  clients,
  budgetCeiling,
  onDelete,
  onStatusChange,
}: ClientStatusGroupProps) {
  const [open, setOpen] = useState(true)

  if (clients.length === 0) return null

  return (
    <>
      {/* Group header row */}
      <TableRow className="hover:bg-transparent">
        <TableCell colSpan={5} className="bg-muted/40 py-2">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex w-full items-center gap-2.5 text-left"
          >
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 text-muted-foreground transition-transform",
                !open && "-rotate-90"
              )}
            />
            <ClientStatusBadge status={status} />
            <span className="tabular rounded-full bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              {clients.length}
            </span>
          </button>
        </TableCell>
      </TableRow>

      {/* Rows */}
      {open &&
        clients.map((client) => (
          <ClientRow
            key={client.id}
            client={client}
            budgetCeiling={budgetCeiling}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
          />
        ))}
    </>
  )
}
