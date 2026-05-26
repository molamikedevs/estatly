import CreateButton from "@/components/CreateButton"
import ViewingFormSheet from "./ViewingFormSheet"

export default function AddViewing() {
  return (
    <CreateButton
      label="Schedule viewing"
      renderSheet={({ open, onOpenChange }) => (
        <ViewingFormSheet open={open} onOpenChange={onOpenChange} />
      )}
    />
  )
}
