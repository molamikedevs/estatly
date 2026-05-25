import { Button } from "@/components/ui/button"
import { UserX } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function ProfileError() {
  const navigate = useNavigate()

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="pattern-dots flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <UserX className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-base font-semibold">
          Couldn't load your profile
        </h3>
        <p className="mt-1 max-w-xs text-sm text-muted-foreground">
          We couldn't retrieve your account details. Your session may have
          expired — try signing in again.
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
            Try again
          </Button>
          <Button size="sm" onClick={() => navigate("/login")}>
            Sign in
          </Button>
        </div>
      </div>
    </div>
  )
}
