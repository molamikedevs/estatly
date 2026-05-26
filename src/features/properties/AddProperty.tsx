import CreateButton from "@/components/CreateButton"
import PropertyFormSheet from "./PropertyFormSheet"

export default function AddProperty() {
  return (
    <CreateButton
      label="Add property"
      renderSheet={({ open, onOpenChange }) => (
        <PropertyFormSheet open={open} onOpenChange={onOpenChange} />
      )}
    />
  )
}
