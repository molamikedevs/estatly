import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

export default function ClientEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h2 className="text-lg font-semibold">Client not found</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        This client may have been removed or you don't have access to it.
      </p>
      <Button asChild variant="outline" size="sm" className="mt-4 gap-2">
        <Link to="/clients">
          <ArrowLeft className="h-4 w-4" />
          Back to clients
        </Link>
      </Button>
    </div>
  )
}
