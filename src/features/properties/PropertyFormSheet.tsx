import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import type { Property } from "@/types/database"
import PropertyForm from "./PropertyForm"

interface PropertyFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  property?: Property // present → edit, absent → create
}

export default function PropertyFormSheet({
  open,
  onOpenChange,
  property,
}: PropertyFormSheetProps) {
  const isEdit = Boolean(property)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:!w-[50vw] sm:!max-w-[720px]"
      >
        <SheetHeader className="border-b px-6 py-5">
          <SheetTitle className="text-lg">
            {isEdit ? "Edit property" : "Add new property"}
          </SheetTitle>
          <SheetDescription className="text-xs">
            {isEdit
              ? "Update the listing details below."
              : "Fill in the details to create a new property listing."}
          </SheetDescription>
        </SheetHeader>

        <PropertyForm property={property} onClose={() => onOpenChange(false)} />
      </SheetContent>
    </Sheet>
  )
}
