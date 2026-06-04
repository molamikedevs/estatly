import { Button } from "@/components/ui/button"
import { useUser } from "@/features/auth/useUser"
import { Plus } from "lucide-react"
import { useState } from "react"
import ManagerCard from "./ManagerCard"
import ManagerCardSkeleton from "./ManagerCardSkeleton.tsx"

import FormSheet from "@/components/form-components/FormSheet"
import ManagerEmptyState from "./ManagerEmptyState"
import ManagerForm from "./ManagerForm"
import { useManagers } from "./useManagers.ts"

export default function ManagerLists() {
  const [createOpen, setCreateOpen] = useState(false)
  const { managers, isLoading } = useManagers()
  const { user } = useUser()

  const role = user?.user_profile?.role
  const canCreateAgent = role === "admin" || role === "manager"
  const hasManagers = !isLoading && managers && managers.length > 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Managers</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your agency team and their access
            {hasManagers && (
              <span className="tabular-nums"> · {managers.length} total</span>
            )}
          </p>
        </div>

        {canCreateAgent && hasManagers && (
          <Button
            onClick={() => setCreateOpen(true)}
            className="gap-2 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Create manager
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ManagerCardSkeleton key={i} />
          ))}
        </div>
      ) : !hasManagers ? (
        <ManagerEmptyState
          isAdmin={canCreateAgent}
          onCreate={() => setCreateOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {managers.map((manager) => (
            <ManagerCard key={manager.user_id} manager={manager} />
          ))}
        </div>
      )}

      <FormSheet
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Create new manager"
        description="The manager will receive sign-in credentials and can immediately access the platform."
      >
        <ManagerForm onClose={() => setCreateOpen(false)} />
      </FormSheet>
    </div>
  )
}
