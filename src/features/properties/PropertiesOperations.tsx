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
          { value: "newest", label: "Newest first" },
          { value: "price-asc", label: "Price: low to high" },
          { value: "price-desc", label: "Price: high to low" },
          { value: "popular", label: "Most viewed" },
        ]}
      />
    </div>
  )
}
