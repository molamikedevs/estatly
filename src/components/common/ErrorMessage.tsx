import { Button } from "@/components/ui/button"
import { getErrorMessage } from "@/lib/errors"
import { DEFAULT_ERROR } from "@/lib/states"
import { CircleAlert } from "lucide-react"
import StateMessage from "./StateMessage"

export default function ErrorMessage({
  error,
  onRetry,
  compact = false,
}: {
  error: unknown
  onRetry?: () => void
  compact?: boolean
}) {
  return (
    <div role="alert">
      <StateMessage
        icon={<CircleAlert />}
        title={getErrorMessage(error)}
        message={DEFAULT_ERROR.message}
        compact={compact}
        action={
          onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry}>
              Try again
            </Button>
          )
        }
      />
    </div>
  )
}
