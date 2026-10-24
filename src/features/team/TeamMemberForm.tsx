import { FormFooter } from "@/components/form-components/FormFooter"
import type { CreatableRole } from "@/types/database"
import UserFields from "./TeamMemberFields"
import { useTeamForm } from "./useTeamForm"

interface TeamMemberFormProps {
  role: CreatableRole
  onClose: () => void
}

export default function TeamMemberForm({ role, onClose }: TeamMemberFormProps) {
  const { form, isPending, onSubmit } = useTeamForm({ role, onClose })

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex flex-1 flex-col overflow-hidden"
    >
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <UserFields control={form.control} role={role} />
      </div>

      <FormFooter
        canSave={!isPending}
        isSubmitting={isPending}
        onCancel={onClose}
        submitLabel={`Add ${role}`}
        submittingLabel="Adding..."
      />
    </form>
  )
}
