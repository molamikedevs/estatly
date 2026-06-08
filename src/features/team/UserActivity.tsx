import { useUser } from "@/features/auth/useUser"
import { formatDate, formatDateTime } from "@/lib/helpers"
import {
  BadgeCheck,
  Calendar,
  Clock,
  Copy,
  User as UserIcon,
} from "lucide-react"
import { useState } from "react"

export default function UserActivity() {
  const { user } = useUser()
  const verified = Boolean(user?.email_confirmed_at)
  const [copied, setCopied] = useState(false)
  function copyId() {
    if (!user?.id) return
    navigator.clipboard.writeText(user.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-card sm:p-8">
      <div className="mb-5">
        <h3 className="text-base font-semibold">Account activity</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Sign-in history and account identifiers
        </p>
      </div>

      <dl className="divide-y divide-border/60">
        {user?.last_sign_in_at && (
          <div className="flex items-center justify-between py-3.5">
            <dt className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Last sign in
            </dt>
            <dd className="tabular text-sm font-medium">
              {formatDateTime(user?.last_sign_in_at)}
            </dd>
          </div>
        )}
        {user?.created_at && (
          <div className="flex items-center justify-between py-3.5">
            <dt className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Member since
            </dt>
            <dd className="tabular text-sm font-medium">
              {formatDate(user.created_at)}
            </dd>
          </div>
        )}
        <div className="flex items-center justify-between py-3.5">
          <dt className="flex items-center gap-2.5 text-sm text-muted-foreground">
            <BadgeCheck className="h-4 w-4" />
            Email verified
          </dt>
          <dd className="tabular text-sm font-medium">
            {verified && user?.email_confirmed_at
              ? formatDate(user?.email_confirmed_at)
              : "Not verified"}
          </dd>
        </div>
        {user?.id && (
          <div className="flex items-center justify-between py-3.5">
            <dt className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <UserIcon className="h-4 w-4" />
              User ID
            </dt>
            <dd className="flex items-center gap-2">
              <code className="rounded-md bg-muted px-2 py-1 font-mono text-xs">
                {user?.id.slice(0, 8)}…{user?.id.slice(-4)}
              </code>
              <button
                onClick={copyId}
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Copy user ID"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
              {copied && (
                <span className="text-xs font-medium text-success">Copied</span>
              )}
            </dd>
          </div>
        )}
      </dl>
    </div>
  )
}
