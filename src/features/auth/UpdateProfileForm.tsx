import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useProfileForm } from "@/hooks/form/useProfileForm"
import AvatarUploader from "./AvatarUploader"
import { FormFooter } from "./FormFooter"
import ProfileFields from "./ProfileFields"

interface UpdateProfileFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function UpdateProfileForm({
  open,
  onOpenChange,
}: UpdateProfileFormProps) {
  const { form, onSubmit, email, isPending, canSave } = useProfileForm({
    open,
    onOpenChange,
  })

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-lg"
      >
        <SheetHeader className="border-b px-6 py-5">
          <SheetTitle className="text-lg">Edit profile</SheetTitle>
          <SheetDescription className="text-xs">
            Update your personal information and how others see you.
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={onSubmit}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 scrollbar-thin space-y-6 overflow-y-auto px-6 py-6">
            <AvatarUploader />
            <ProfileFields
              control={form.control}
              setValue={form.setValue}
              email={email}
            />
          </div>

          <FormFooter
            canSave={canSave}
            isSubmitting={isPending}
            onCancel={() => onOpenChange(false)}
            submitLabel="Save changes"
            submittingLabel="Saving…"
          />
        </form>
      </SheetContent>
    </Sheet>
  )
}
