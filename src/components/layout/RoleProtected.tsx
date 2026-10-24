import Loader from "@/components/Loader"
import { useUser } from "@/features/auth/useUser"
import type { UserRole } from "@/types/database"
import { useEffect, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"

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
  const navigate = useNavigate()
  const { isLoading, user } = useUser()

  const userRole = user?.user_profile?.role as UserRole | undefined
  const hasAccess = userRole ? allowed.includes(userRole) : false

  useEffect(() => {
    if (!isLoading && !hasAccess) {
      navigate(fallbackPath, { replace: true })
    }
  }, [isLoading, hasAccess, navigate, fallbackPath])

  // Inside the layout, so the sidebar stays visible
  if (isLoading) return <Loader fullScreen={false} />

  if (hasAccess) {
    return <>{children}</>
  }

  return null
}
