import AvatarUploader from "@/components/AvatarUploader"
import { FormFooter } from "@/components/form-components/FormFooter"
import ProfileFields from "@/features/auth/ProfileFields"
import { useUserProfileForm } from "@/features/auth/useUserProfileForm"

interface UpdateUserProfileFormProps {
  open: boolean
  onClose: () => void
}

export default function UpdateUserProfilesForm({
  open,
  onClose,
}: UpdateUserProfileFormProps) {
  const { form, onSubmit, email, isPending, canSave } = useUserProfileForm({
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
