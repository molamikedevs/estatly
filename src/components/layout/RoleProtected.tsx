import { useUser } from "@/features/auth/useUser"
import type { UserRole } from "@/types"
import { useEffect, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import Spinner from "../spinner"

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

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (hasAccess) {
    return <>{children}</>
  }

  return null
}
