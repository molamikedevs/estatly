import Loader from "@/components/common/Loader"
import { useUser } from "@/features/auth/useUser"
import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"

interface Props {
  children: ReactNode
}

export default function ProtectedRoute({ children }: Props) {
  const { isLoading, isAuthenticated } = useUser()

  // Show the brand loader while checking the session
  if (isLoading) return <Loader />

  // Not signed in: go to login, replacing this entry in history
  if (!isAuthenticated) return <Navigate to="/login" replace />

  return <>{children}</>
}
