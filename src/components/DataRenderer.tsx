import type { EmptyState } from "@/lib/states"
import type { ReactNode } from "react"
import EmptyMessage from "./common/EmptyMessage"
import ErrorMessage from "./common/ErrorMessage"

//Loading → error → empty → data

interface DataRendererProps<T> {
  data: T[] | undefined
  isLoading?: boolean
  error?: unknown
  loading?: ReactNode
  empty: EmptyState
  compact?: boolean
  onRetry?: () => void
  render: (data: T[]) => ReactNode
}

export default function DataRenderer<T>({
  data,
  isLoading = false,
  error,
  loading,
  empty,
  compact = false,
  onRetry,
  render,
}: DataRendererProps<T>) {
  if (isLoading) return <>{loading}</>

  if (error) {
    return <ErrorMessage error={error} onRetry={onRetry} compact={compact} />
  }

  if (!data || data.length === 0) {
    return <EmptyMessage empty={empty} compact={compact} />
  }

  return <>{render(data)}</>
}
