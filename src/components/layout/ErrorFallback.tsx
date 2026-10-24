import BrandMark from "@/components/BrandMark"
import Heading from "@/components/Heading"
import { Button } from "@/components/ui/button"
import { getErrorMessage } from "@/lib/errors"
import type { FallbackProps } from "react-error-boundary"

// This renders outside the router, so navigation uses window.location
export default function ErrorFallback({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  return (
    <main
      role="alert"
      className="flex min-h-svh items-center justify-center bg-background px-4 py-12"
    >
      <div className="w-full max-w-md text-center">
        <BrandMark className="mx-auto size-12" />

        <Heading as="h1" className="mt-6 text-2xl">
          Something went wrong
        </Heading>
        <p className="mt-2 text-muted-foreground">
          This page could not load. Try again, or go back to the dashboard.
        </p>

        {/* Technical details for you while developing, never for users */}
        {import.meta.env.DEV && (
          <pre className="mt-6 max-h-40 overflow-auto rounded-lg border bg-muted p-3 text-left font-mono text-xs text-destructive">
            {getErrorMessage(error)}
          </pre>
        )}

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
          <Button
            variant="outline"
            onClick={() => window.location.assign("/dashboard")}
          >
            Go to dashboard
          </Button>
          <Button onClick={resetErrorBoundary}>Try again</Button>
        </div>
      </div>
    </main>
  )
}
