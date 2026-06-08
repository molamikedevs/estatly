import Spinner from "@/components/SpinnerMini"
import { Button } from "@/components/ui/button"

interface FormFooterProps {
  canSave: boolean
  isSubmitting: boolean
  onCancel: () => void
  submitLabel?: string
  submittingLabel?: string
  variant?: "drawer" | "card"
}

export function FormFooter({
  canSave,
  isSubmitting,
  onCancel,
  submitLabel = "Save changes",
  submittingLabel = "Saving…",
}: FormFooterProps) {
  return (
    <div className="flex items-center justify-end gap-2 border-t bg-muted/30 px-6 py-4">
      <Button
        type="button"
        variant="ghost"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancel
      </Button>

      <Button
        type="submit"
        disabled={!canSave}
        className="min-w-[120px] gap-2 shadow-sm"
      >
        {isSubmitting ? (
          <>
            <Spinner size="sm" />
            {submittingLabel}
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </div>
  )
}
