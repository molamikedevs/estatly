import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import ClientForm from "./ClientForm"

interface ClientFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ClientFormSheet({
  open,
  onOpenChange,
}: ClientFormSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:!w-[50vw] sm:!max-w-[680px]"
      >
        <SheetHeader className="border-b px-6 py-5">
          <SheetTitle className="text-lg">Add new client</SheetTitle>
          <SheetDescription className="text-xs">
            Capture the client's details and preferences to start tracking them
            in your pipeline.
          </SheetDescription>
        </SheetHeader>

        <ClientForm onClose={() => onOpenChange(false)} />
      </SheetContent>
    </Sheet>
  )
}
