import { useUser } from "@/features/auth/useUser"
import { can } from "@/lib/permissions"
import type { Property } from "@/types/database"

/** One place for "what can the current user do with this property". */
export function usePropertyPermissions(property: Property) {
  const { user } = useUser()
  const role = user?.user_profile?.role

  if (!role) {
    return {
      canEdit: false,
      canPublish: false,
      canSetSaleStatus: false,
      canDelete: false,
    }
  }

  // Agents edit only their own listings; managers and admins edit any
  const isOwner = property.agent_id === user?.id

  return {
    canEdit: can.editAnyProperty(role) || (role === "agent" && isOwner),
    canPublish: can.publishProperty(role),
    canSetSaleStatus: can.setSaleStatus(role),
    canDelete: can.deleteProperty(role),
  }
}
