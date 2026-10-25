import Filter from "@/components/common/Filter"
import SearchInput from "@/components/common/SearchInput"
import SortBy from "@/components/common/SortBy"
import { SEARCH_PLACEHOLDERS, viewingStatusOptions } from "@/lib/constants"

export default function ViewingsOperations() {
  return (
    <div className="space-y-3 rounded-xl border border-border/60 bg-card/40 p-3 sm:p-4">
      {/* Row 1: search takes all remaining space, sort hugs the right at the same height */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1 [&_input]:h-10 [&_input]:w-full">
          <SearchInput placeholder={SEARCH_PLACEHOLDERS["/viewings"]} />
        </div>

        <div className="flex items-center gap-2 sm:shrink-0">
          <span className="hidden text-sm text-muted-foreground lg:inline">
            Sort by
          </span>
          <div className="w-full sm:w-44 [&_button]:h-10 [&_button]:w-full [&_select]:h-10 [&_select]:w-full">
            <SortBy
              options={[
                { value: "latest", label: "Latest first" },
                { value: "soonest", label: "Earliest first" },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Divider separates "find" controls from "filter" controls */}
      <div className="h-px bg-border/50" />

      {/* Row 2: status filter, full width, scrolls sideways on phones instead of wrapping */}
      <div className="scrollbar-hidden -mx-3 overflow-x-auto px-3 sm:mx-0 sm:px-0">
        <div className="w-max min-w-full sm:w-full [&>*]:w-full [&>*]:justify-between">
          <Filter
            filterField="status"
            options={[{ value: "all", label: "All" }, ...viewingStatusOptions]}
          />
        </div>
      </div>
    </div>
  )
}
