import Filter from "@/components/Filter"
import SortBy from "@/components/SortBy"

export default function ViewingsOperations() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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

      <SortBy
        options={[
          { value: "soonest", label: "Soonest first" },
          { value: "latest", label: "Latest first" },
        ]}
      />
    </div>
  )
}
