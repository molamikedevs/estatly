import Spinner from "@/components/common/SpinnerMini"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"

interface ConfirmDeleteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isPending?: boolean
  title?: string
  description?: string
  resourceName?: string
  confirmLabel?: string
}

export default function ConfirmDelete({
  open,
  onOpenChange,
  onConfirm,
  isPending = false,
  title,
  description,
  resourceName,
  confirmLabel = "Delete",
}: ConfirmDeleteProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {title ?? `Delete ${resourceName ?? "this item"}?`}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {description ??
              `This action is permanent and can't be undone. ${
                resourceName ? `"${resourceName}"` : "This item"
              } will be removed for everyone.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault() // keep dialog open until the mutation finishes
              onConfirm()
            }}
            disabled={isPending}
            className={cn(
              "min-w-[100px] gap-2 bg-destructive text-white",
              "hover:bg-destructive/90 focus-visible:ring-destructive/30"
            )}
          >
            {isPending ? (
              <>
                <Spinner size="sm" />
                Deleting…
              </>
            ) : (
              confirmLabel
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
