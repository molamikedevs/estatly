import Heading from "@/components/Heading"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Compass, Home, Search } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

export default function PageNotFound() {
  const navigate = useNavigate()

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
      <div className="spotlight pointer-events-none absolute inset-0 opacity-60" />
      <div className="pattern-dots pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)] opacity-30" />

      <div className="relative w-full max-w-[520px] text-center">
        <div className="relative mx-auto mb-8 flex h-32 w-32 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-primary/10 blur-2xl" />
          <span className="text-gradient tabular relative text-[110px] leading-none font-bold tracking-tighter">
            404
          </span>
        </div>

        <Heading as="h2" className="text-3xl">
          Page not found
        </Heading>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved. Let's get
          you back on track.
        </p>

        <div className="mt-7 flex flex-col items-center justify-center gap-2 sm:flex-row">
          <Button
            variant="outline"
            size="default"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go back
          </Button>
          <Button asChild size="default" className="gap-2 shadow-sm">
            <Link to="/dashboard">
              <Home className="h-4 w-4" />
              Back to dashboard
            </Link>
          </Button>
        </div>

        <div className="mx-auto mt-12 max-w-md">
          <p className="mb-3 text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
            You might be looking for
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            <Link
              to="/properties"
              className="group flex items-center gap-3 rounded-lg border border-border/60 bg-card/60 p-3 text-left backdrop-blur-sm transition-colors hover:bg-accent"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Search className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium">Browse properties</p>
                <p className="truncate text-xs text-muted-foreground">
                  View all listings
                </p>
              </div>
            </Link>
            <Link
              to="/dashboard"
              className="group flex items-center gap-3 rounded-lg border border-border/60 bg-card/60 p-3 text-left backdrop-blur-sm transition-colors hover:bg-accent"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Compass className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium">Dashboard</p>
                <p className="truncate text-xs text-muted-foreground">
                  Overview and stats
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
