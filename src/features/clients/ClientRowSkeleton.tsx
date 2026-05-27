import { TableCell, TableRow } from "@/components/ui/table"

export default function ClientRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="shimmer h-9 w-9 shrink-0 rounded-full" />
          <div className="space-y-1.5">
            <div className="shimmer h-3.5 w-28 rounded" />
            <div className="shimmer h-3 w-16 rounded" />
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-1.5">
          <div className="shimmer h-3 w-36 rounded" />
          <div className="shimmer h-3 w-28 rounded" />
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-2">
          <div className="shimmer h-3.5 w-32 rounded" />
          <div className="shimmer h-1 w-full rounded-full" />
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="shimmer h-7 w-7 rounded-full" />
          <div className="shimmer h-3.5 w-24 rounded" />
        </div>
      </TableCell>
      <TableCell>
        <div className="shimmer ml-auto h-8 w-8 rounded" />
      </TableCell>
    </TableRow>
  )
}
