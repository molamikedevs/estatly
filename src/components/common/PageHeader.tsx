import PageTitle from "@/components/common/PageTitle"

interface Props {
  isLoading?: boolean
  count?: number
  title: string
  subText: string
  pageTitle?: string
}

export default function PageHeader({
  isLoading,
  count = 0,
  title,
  subText,
  pageTitle,
}: Props) {
  return (
    <div>
      <PageTitle title={pageTitle ?? title} />
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {subText}
        {!isLoading && count > 0 && (
          <span className="tabular-nums"> · {count} total</span>
        )}
      </p>
    </div>
  )
}
