import Filter from "@/components/Filter"
import SortBy from "@/components/SortBy"

export default function ViewingsOperations() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="scrollbar-hidden -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <Filter
          filterField="status"
          options={[
            { value: "all", label: "All" },
            { value: "scheduled", label: "Scheduled" },
            { value: "completed", label: "Completed" },
            { value: "cancelled", label: "Cancelled" },
            { value: "no-show", label: "No-show" },
            { value: "offer-made", label: "Offer made" },
          ]}
        />
      </div>

      <SortBy
        options={[
          { value: "soonest", label: "Soonest first" },
          { value: "latest", label: "Latest first" },
        ]}
      />
    </div>
  )
}
