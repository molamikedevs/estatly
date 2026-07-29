import { Button } from "@/components/ui/button"
import { DEFAULT_ERROR } from "@/lib/constants"
import { AlertCircle, Inbox } from "lucide-react"
import type { ReactNode } from "react"
import { Link } from "react-router-dom"

interface StateConfig {
  title: string
  message: string
  button?: { text: string; href: string }
}

interface DataRendererProps<T> {
  success: boolean
  error?: { message?: string; details?: Record<string, string[]> }
  data: T[] | null | undefined
  empty: StateConfig
  render: (data: T[]) => ReactNode
}

function StateSkeleton({
  icon,
  title,
  message,
  button,
}: {
  icon: ReactNode
  title: string
  message: string
  button?: { text: string; href: string }
}) {
  return (
    <div className="pattern-dots flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">{message}</p>
      {button && (
        <div className="mt-5">
          <Link to={button.href}>
            <Button size="lg">{button.text}</Button>
          </Link>
        </div>
      )}
    </div>
  )
}

export default function DataRenderer<T>({
  success,
  error,
  data,
  empty,
  render,
}: DataRendererProps<T>) {
  if (!success) {
    return (
      <StateSkeleton
        icon={<AlertCircle className="h-7 w-7" />}
        title={error?.message || DEFAULT_ERROR.title}
        message={DEFAULT_ERROR.message}
      />
    )
  }

  if (!data || data.length === 0) {
    return (
      <StateSkeleton
        icon={<Inbox className="h-7 w-7" />}
        title={empty.title}
        message={empty.message}
        button={empty.button}
      />
    )
  }

  return <>{render(data)}</>
}
