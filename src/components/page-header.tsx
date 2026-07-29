interface Props {
  count?: number
  isLoading?: boolean
  heading?: string
  subText?: string
}

export default function PageHeader({
  count = 0,
  isLoading = false,
  heading,
  subText,
}: Props) {
  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight">{heading}</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {subText}
        {!isLoading && count > 0 && (
          <span className="tabular"> · {count} total</span>
        )}
      </p>
    </div>
  )
}
