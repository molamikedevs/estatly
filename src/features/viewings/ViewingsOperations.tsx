import Filter from "@/components/Filter"
import SortBy from "@/components/SortBy"
import { viewingStatusOptions } from "@/lib/constants"

export default function ViewingsOperations() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Scrolls sideways on phones instead of wrapping */}
      <div className="scrollbar-hidden -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <Filter
          filterField="status"
          options={[{ value: "all", label: "All" }, ...viewingStatusOptions]}
        />
      </div>

      <SortBy
        options={[
          { value: "latest", label: "Latest first" },
          { value: "soonest", label: "Earliest first" },
        ]}
      />
    </div>
  )
}
