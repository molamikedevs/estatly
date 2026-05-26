import CreateButton from "@/components/CreateButton"
import { useUser } from "@/features/auth/useUser"
import { useState } from "react"
import AgentCard from "./AgentCard"
import AgentCardSkeleton from "./AgentCardSkeleton"
import AgentsEmptyState from "./AgentEmptyState"
import CreateAgentForm from "./CreateAgentForm"
import { useAgents } from "./useAgents"

export default function AgentLists() {
  const [openCreateAgentForm, setOpenCreateAgentForm] = useState(false)
  const { agents, isLoading } = useAgents()
  const { user } = useUser()

  const role = user?.user_profile?.role
  const canCreateAgent = role === "admin" || role === "manager"
  const hasAgents = !isLoading && agents && agents.length > 0

  return (
    <div className="space-y-6">
      {/* ── Page header ────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Agents</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your agency team and their access
            {hasAgents && (
              <span className="tabular"> · {agents.length} total</span>
            )}
          </p>
        </div>
        {canCreateAgent && hasAgents && (
          <CreateButton
            label="Create agent"
            renderSheet={({ open, onOpenChange }) => (
              <CreateAgentForm open={open} onOpenChange={onOpenChange} />
            )}
          />
        )}
      </div>

      {/* ── Content ────────────────────────────── */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <AgentCardSkeleton key={i} />
          ))}
        </div>
      ) : !hasAgents ? (
        <AgentsEmptyState
          isAdmin={canCreateAgent}
          onCreate={() => setOpenCreateAgentForm(true)}
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <AgentCard key={agent.user_id} agent={agent} />
          ))}
        </div>
      )}

      {/* ── Create agent drawer ────────────────── */}
      <CreateAgentForm
        open={openCreateAgentForm}
        onOpenChange={setOpenCreateAgentForm}
      />
    </div>
  )
}
