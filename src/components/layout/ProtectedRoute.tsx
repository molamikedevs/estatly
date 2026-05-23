import Spinner from "@/components/Spinner"
import { useUser } from "@/features/auth/useUser"
import { useEffect, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"

interface Props {
  children: ReactNode
}

export default function ProtectedRoute({ children }: Props) {
  const navigate = useNavigate()
  const { isLoading, isAuthenticated } = useUser()

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate("/login", { replace: true })
    }
  }, [isAuthenticated, isLoading, navigate])

  // Show spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    )
  }

  // Only render children if authenticated
  if (isAuthenticated) {
    return <>{children}</>
  }

  // While redirect is happening, render nothing
  return null
}
