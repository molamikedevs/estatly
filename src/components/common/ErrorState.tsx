import { Button } from "@/components/ui/button"
import { getErrorMessage } from "@/lib/errors"

export default function ErrorState({
  error,
  onRetry,
}: {
  error: unknown
  onRetry?: () => void
}) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-dashed p-8 text-center"
    >
      <p className="font-medium">This could not load</p>
      <p className="mt-1 text-sm text-muted-foreground">
        {getErrorMessage(error)}
      </p>
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}
