import Heading from "@/components/Heading"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Home, RefreshCw } from "lucide-react"
import type { FallbackProps } from "react-error-boundary"

export default function ErrorFallback({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "Unknown error"

  return (
    <main
      role="alert"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12"
    >
      <div className="spotlight pointer-events-none absolute inset-0 opacity-60" />
      <div className="pattern-dots pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)] opacity-30" />

      <div className="relative w-full max-w-[480px]">
        <div className="rounded-2xl border border-border/60 bg-card/80 p-8 shadow-card backdrop-blur-sm">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <span className="absolute inset-0 animate-ping rounded-2xl bg-destructive/15" />
              <AlertTriangle className="relative h-7 w-7" strokeWidth={2.25} />
            </div>

            <Heading as="h2" className="text-2xl">
              Something went wrong
            </Heading>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              An unexpected error occurred while loading this page. You can try
              again, or head back to the dashboard.
            </p>

            <div className="mt-5 w-full overflow-hidden rounded-lg border border-destructive/20 bg-destructive/5 text-left">
              <div className="border-b border-destructive/20 bg-destructive/5 px-3.5 py-2">
                <p className="text-[10px] font-semibold tracking-[0.1em] text-destructive uppercase">
                  Error details
                </p>
              </div>
              <pre className="max-h-32 scrollbar-thin overflow-auto px-3.5 py-2.5 font-mono text-xs leading-relaxed text-destructive/90">
                {message}
              </pre>
            </div>

            <div className="mt-6 flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-center">
              <Button
                variant="outline"
                size="default"
                onClick={() => (window.location.href = "/dashboard")}
                className="gap-2"
              >
                <Home className="h-4 w-4" />
                Go to dashboard
              </Button>
              <Button
                onClick={resetErrorBoundary}
                size="default"
                className="gap-2 shadow-sm"
              >
                <RefreshCw className="h-4 w-4" />
                Try again
              </Button>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          If this keeps happening, please contact support.
        </p>
      </div>
    </main>
  )
}
