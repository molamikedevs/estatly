import { Button } from "@/components/ui/button"
import { UserX } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function ManagerNotFound() {
  const navigate = useNavigate()

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center rounded-2xl border bg-card py-16 text-center shadow-card">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <UserX className="h-7 w-7 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-base font-semibold">Manager not found</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        This agent may have been removed, or the link is incorrect.
      </p>
      <Button
        variant="outline"
        size="sm"
        className="mt-5"
        onClick={() => navigate("/agents")}
      >
        Back to agents
      </Button>
    </div>
  )
}
