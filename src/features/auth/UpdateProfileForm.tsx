import { useProfileForm } from "@/hooks/form/useProfileForm"
import AvatarUploader from "./AvatarUploader"
import { FormFooter } from "./FormFooter"
import ProfileFields from "./ProfileFields"

interface UpdateProfileFormProps {
  open: boolean
  onClose: () => void
}

export default function UpdateProfileForm({
  open,
  onClose,
}: UpdateProfileFormProps) {
  const { form, onSubmit, email, isPending, canSave } = useProfileForm({
    open,
    onOpenChange: (next) => {
      if (!next) onClose()
    },
  })

  return (
    <form onSubmit={onSubmit} className="flex flex-1 flex-col overflow-hidden">
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
        onCancel={onClose}
        submitLabel="Save changes"
        submittingLabel="Saving…"
      />
    </form>
  )
}
