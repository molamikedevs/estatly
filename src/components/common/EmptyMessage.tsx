import { Button } from "@/components/ui/button"
import type { EmptyState } from "@/lib/states"
import { Inbox } from "lucide-react"
import { Link } from "react-router-dom"
import StateMessage from "./StateMessage"

export default function EmptyMessage({
  empty,
  compact = false,
}: {
  empty: EmptyState
  compact?: boolean
}) {
  return (
    <StateMessage
      icon={<Inbox />}
      title={empty.title}
      message={empty.message}
      compact={compact}
      action={
        empty.button && (
          <Button asChild variant="outline" size="sm">
            <Link to={empty.button.href}>{empty.button.text}</Link>
          </Button>
        )
      }
    />
  )
}
