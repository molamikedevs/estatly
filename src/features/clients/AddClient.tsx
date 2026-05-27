import CreateButton from "@/components/CreateButton"
import ClientFormSheet from "./ClientFormSheet"

export default function AddClient() {
  return (
    <CreateButton
      label="Add new client"
      renderSheet={({ open, onOpenChange }) => (
        <ClientFormSheet open={open} onOpenChange={onOpenChange} />
      )}
    />
  )
}
