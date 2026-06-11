import Filter from "@/components/Filter"
import SortBy from "@/components/SortBy"

export default function PropertiesOperations() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <Filter
        filterField="listing_type"
        options={[
          { value: "all", label: "All" },
          { value: "rent", label: "For rent" },
          { value: "sale", label: "For sale" },
        ]}
      />

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
