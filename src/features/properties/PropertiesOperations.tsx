import Filter from "@/components/common/Filter"
import SearchInput from "@/components/common/SearchInput"
import SortBy from "@/components/common/SortBy"
import { SEARCH_PLACEHOLDERS } from "@/lib/constants"

export default function PropertiesOperations() {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Filter
          filterField="listing_type"
          options={[
            { value: "all", label: "All" },
            { value: "rent", label: "For rent" },
            { value: "sale", label: "For sale" },
          ]}
        />
        <SearchInput placeholder={SEARCH_PLACEHOLDERS["/properties"]} />
      </div>

      <SortBy
        options={[
          { value: "newest", label: "Newest" },
          { value: "oldest", label: "Oldest" },
          { value: "price-desc", label: "Highest price" },
          { value: "price-asc", label: "Lowest price" },
          { value: "views-desc", label: "Most views" },
        ]}
      />
    </div>
  )
}
