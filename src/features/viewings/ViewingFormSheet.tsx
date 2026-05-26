import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import type { Viewing } from "@/types/database"
import ViewingForm from "./ViewingForm"

interface ViewingFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  viewing?: Viewing
}

export default function ViewingFormSheet({
  open,
  onOpenChange,
  viewing,
}: ViewingFormSheetProps) {
  const isEdit = Boolean(viewing)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0">
        <SheetHeader className="border-b px-6 py-5">
          <SheetTitle className="text-lg">
            {isEdit ? "Edit viewing" : "Schedule new viewing"}
          </SheetTitle>
          <SheetDescription className="text-xs">
            {isEdit
              ? "Update the appointment details below."
              : "Book a property viewing by filling in the details below."}
          </SheetDescription>
        </SheetHeader>

        <ViewingForm viewing={viewing} onClose={() => onOpenChange(false)} />
      </SheetContent>
    </Sheet>
  )
}
