import { TableCell, TableRow } from "@/components/ui/table"

export default function ViewingRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="shimmer h-10 w-12 shrink-0 rounded-md" />
          <div className="space-y-1.5">
            <div className="shimmer h-3.5 w-36 rounded" />
            <div className="shimmer h-3 w-24 rounded" />
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-1.5">
          <div className="shimmer h-3.5 w-28 rounded" />
          <div className="shimmer h-3 w-32 rounded" />
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="shimmer h-7 w-7 rounded-full" />
          <div className="shimmer h-3.5 w-24 rounded" />
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-1.5">
          <div className="shimmer h-3.5 w-14 rounded" />
          <div className="shimmer h-3 w-20 rounded" />
        </div>
      </TableCell>
      <TableCell>
        <div className="shimmer h-5 w-20 rounded-full" />
      </TableCell>
      <TableCell>
        <div className="shimmer h-8 w-8 rounded" />
      </TableCell>
    </TableRow>
  )
}
