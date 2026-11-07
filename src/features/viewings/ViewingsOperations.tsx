import Filter from "@/components/common/Filter"
import SearchInput from "@/components/common/SearchInput"
import SortBy from "@/components/common/SortBy"
import {
  SEARCH_PLACEHOLDERS,
  viewingSortOptions,
  viewingStatusOptions,
} from "@/lib/constants"

export default function ViewingsOperations() {
  return (
    <div className="space-y-3">
      {/* Find: search on the left, sort on the right; stacked on phones */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput placeholder={SEARCH_PLACEHOLDERS["/viewings"]} />
        <SortBy options={viewingSortOptions} />
      </div>

      {/* Narrow: the status filter hugs its buttons and scrolls on phones */}
      <div className="scrollbar-hidden overflow-x-auto">
        <Filter
          filterField="status"
          options={[{ value: "all", label: "All" }, ...viewingStatusOptions]}
        />
      </div>
    </div>
  )
}
