import BackLink from "@/components/BackLink"
import RoleBadge from "@/components/RoleBadge"
import UserAvatar from "@/components/UserAvatar"
import { Button } from "@/components/ui/button"
import ProfileSkeleton from "@/features/auth/ProfileSkeleton"
import { Briefcase, Calendar, Mail, MessageSquare, Phone } from "lucide-react"
import { Link } from "react-router-dom"
import ManagerNotFound from "./ManagerNotFount"
import { useManager } from "./useManager"

export default function ManagerProfile() {
  const { manager, isLoading, error } = useManager()

  if (isLoading) return <ProfileSkeleton />
  if (error || !manager) return <ManagerNotFound />

  const displayName = manager.full_name || manager.email || "Unnamed manager"
  const joinedDate = manager.created_at
    ? new Date(manager.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
    : null

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <BackLink route="/managers" label="Back to managers" />

      {/* ── Hero — side-by-side identity + actions ──────────── */}
      <section className="overflow-hidden rounded-2xl border bg-card shadow-card">
        <div className="relative h-24 bg-gradient-to-br from-primary via-primary/85 to-primary/60 sm:h-28">
          <div className="spotlight absolute inset-0 opacity-50" />
          <div className="pattern-dots absolute inset-0 opacity-30" />
        </div>

        <div className="px-5 pb-5 sm:px-8 sm:pb-7">
          <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <UserAvatar
                name={displayName}
                src={manager.avatar}
                size="2xl"
                ring
                className="shadow-elevated ring-4"
              />
              <div className="min-w-0 sm:pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-xl font-semibold tracking-tight sm:text-2xl">
                    {displayName}
                  </h2>
                  <RoleBadge role={manager.role} />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {manager.specialization || "No specialization set"}
                </p>
                {joinedDate && (
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    Joined {joinedDate}
                  </p>
                )}
              </div>
            </div>

            {/* Quick actions — contact the manager */}
            <div className="flex flex-wrap gap-2 sm:pb-1">
              {manager.email && (
                <Button asChild variant="outline" size="sm" className="gap-1.5">
                  <a href={`mailto:${manager.email}`}>
                    <Mail className="h-3.5 w-3.5" />
                    Email
                  </a>
                </Button>
              )}
              {manager.phone && (
                <Button asChild variant="outline" size="sm" className="gap-1.5">
                  <a href={`tel:${manager.phone}`}>
                    <Phone className="h-3.5 w-3.5" />
                    Call
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Two-column body ──────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        {/* Left — bio + contact */}
        <div className="space-y-6">
          {/* Bio */}
          <section className="rounded-2xl border bg-card p-5 shadow-card sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">About</h3>
            </div>
            {manager.bio ? (
              <p className="text-sm leading-relaxed text-foreground">
                {manager.bio}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                {displayName} hasn't added a bio yet.
              </p>
            )}
          </section>
        </div>

        {/* Right sidebar — contact card */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <section className="rounded-2xl border bg-card p-5 shadow-card sm:p-6">
            <h3 className="mb-4 text-sm font-semibold">Contact</h3>
            <dl className="space-y-3.5 text-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Mail className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <dt className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                    Email
                  </dt>
                  <dd className="truncate">
                    {manager.email ? (
                      <Link
                        to={`mailto:${manager.email}`}
                        className="text-primary hover:underline"
                      >
                        {manager.email}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground/60 italic">
                        Not provided
                      </span>
                    )}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Phone className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <dt className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                    Phone
                  </dt>
                  <dd className="truncate">
                    {manager.phone ? (
                      <Link
                        to={`tel:${manager.phone}`}
                        className="text-primary hover:underline"
                      >
                        {manager.phone}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground/60 italic">
                        Not provided
                      </span>
                    )}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Briefcase className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <dt className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                    Specialization
                  </dt>
                  <dd>
                    {manager.specialization ?? (
                      <span className="text-muted-foreground/60 italic">
                        Not specified
                      </span>
                    )}
                  </dd>
                </div>
              </div>
            </dl>
          </section>
        </aside>
      </div>
    </div>
  )
}
