import SpinnerMini from "@/components/common/SpinnerMini"
import { Button } from "@/components/ui/button"

// Render inside a <form>, only when the form has unsaved changes.
// Sticky, so it stays in reach and sits above the phone tab bar.
export default function SaveBar({
  isPending,
  onDiscard,
}: {
  isPending: boolean
  onDiscard: () => void
}) {
  return (
    <div className="sticky bottom-[calc(5rem+env(safe-area-inset-bottom))] mt-4 flex animate-in items-center justify-between gap-3 rounded-xl border bg-card p-3 pl-4 shadow-lg fade-in slide-in-from-bottom-2 md:bottom-4">
      <p className="text-sm text-muted-foreground">Unsaved changes</p>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="ghost"
          disabled={isPending}
          onClick={onDiscard}
        >
          Discard
        </Button>
        <Button type="submit" disabled={isPending} className="gap-2">
          {isPending && <SpinnerMini size="sm" />}
          {isPending ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </div>
  )
}
