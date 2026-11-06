import { FormFooter } from "@/components/form-components/FormFooter"
import PasswordField from "@/components/form-components/PasswordField"
import TextField from "@/components/form-components/TextField"
import { FieldGroup } from "@/components/ui/field"
import type { CreatableRole } from "@/types/database"
import { Mail, User as UserIcon } from "lucide-react"
import { useTeamMemberCreateForm } from "./useTeamMemberCreateForm"

interface TeamMemberCreateFormProps {
  role: CreatableRole
  onClose: () => void
}

export default function TeamMemberCreateForm({
  role,
  onClose,
}: TeamMemberCreateFormProps) {
  const { form, isPending, onSubmit } = useTeamMemberCreateForm({
    role,
    onClose,
  })
  const { control } = form

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex flex-1 flex-col overflow-hidden"
    >
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <FieldGroup className="space-y-5">
          <TextField
            control={control}
            name="full_name"
            id="member-new-name"
            label="Full name"
            icon={UserIcon}
            placeholder="Omar Al-Rashid"
            autoComplete="off"
            required
          />
          <TextField
            control={control}
            name="email"
            id="member-new-email"
            label="Email"
            icon={Mail}
            type="email"
            placeholder="name@agency.com"
            autoComplete="off"
            required
          />
          <PasswordField
            control={control}
            name="password"
            id="member-new-password"
            label="Temporary password"
            placeholder="At least 8 characters"
            required
          />

          <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
            Share the email and password with the {role} yourself. They can
            change the password from their profile after signing in.
          </p>
        </FieldGroup>
      </div>

      <FormFooter
        canSave={!isPending}
        isSubmitting={isPending}
        onCancel={onClose}
        submitLabel={`Add ${role}`}
        submittingLabel="Adding…"
      />
    </form>
  )
}
