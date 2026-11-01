import Loader from "@/components/common/Loader"
import { useUser } from "@/features/auth/useUser"
import type { UserRole } from "@/types/database"
import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"

interface Props {
  children: ReactNode
  allowed: UserRole[]
  fallbackPath?: string
}

export default function RoleProtected({
  children,
  allowed,
  fallbackPath = "/dashboard",
}: Props) {
  const { isLoading, user } = useUser()

  // Inside the layout, so the sidebar stays visible
  if (isLoading) return <Loader fullScreen={false} />

  const role = user?.user_profile?.role
  const hasAccess = role ? allowed.includes(role) : false

  // Wrong role: send them somewhere they are allowed to be
  if (!hasAccess) return <Navigate to={fallbackPath} replace />

  return <>{children}</>
}
