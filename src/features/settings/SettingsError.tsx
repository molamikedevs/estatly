import { Button } from "@/components/ui/button"
import { CloudOff, RefreshCw } from "lucide-react"

export default function SettingsError({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="pattern-dots flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <CloudOff className="h-7 w-7" />
      </div>
      <h3 className="mt-4 text-base font-semibold">
        Couldn't load your settings
      </h3>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">
        We couldn't reach the server. Check your connection and try again — if
        it persists, contact support.
      </p>
      <div className="mt-5">
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry ?? (() => window.location.reload())}
          className="gap-1.5"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Try again
        </Button>
      </div>
    </div>
  )
}
