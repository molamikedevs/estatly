import type { CreatableRole } from "@/types/database"
import { FormFooter } from "../../components/form-components/FormFooter"
import UserFields from "./UserFields"
import { useUserForm } from "./useUserForm"

interface UserFormProps {
  role: CreatableRole
  onClose: () => void
}

const submitLabel: Record<CreatableRole, string> = {
  agent: "Create Agent",
  manager: "Create Manager",
}

export default function UserForm({ role, onClose }: UserFormProps) {
  const { form, canSave, isPending, onSubmit, handleCancel } = useUserForm({
    role,
    onClose,
  })

  return (
    <form onSubmit={onSubmit} className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 scrollbar-thin overflow-y-auto px-6 py-6">
        <UserFields control={form.control} role={role} />
      </div>

      <FormFooter
        canSave={canSave}
        isSubmitting={isPending}
        onCancel={handleCancel}
        submitLabel={submitLabel[role]}
        submittingLabel="Creating…"
      />
    </form>
  )
}
