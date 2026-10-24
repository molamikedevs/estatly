import IconField from "@/components/form-components/IconField"
import PasswordField from "@/components/form-components/PasswordField"
import { FieldGroup } from "@/components/ui/field"
import type { CreatableRole } from "@/types/database"
import type { AgentFieldsProps } from "@/types/global"
import { Mail, User as UserIcon } from "lucide-react"

interface TeamMemberFieldsProps extends AgentFieldsProps {
  role: CreatableRole
}

export default function TeamMemberFields({
  control,
  role,
}: TeamMemberFieldsProps) {
  return (
    <FieldGroup className="space-y-5">
      <IconField
        control={control}
        name="full_name"
        id="user-name"
        label="Full name"
        icon={UserIcon}
        placeholder="Omar Al-Rashid"
        autoComplete="off"
        required
      />

      <IconField
        control={control}
        name="email"
        id="user-email"
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
        id="user-password"
        label="Temporary password"
        placeholder="At least 8 characters"
        required
      />

      <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
        Share the email and password with the {role} yourself. They can change
        the password from their profile after signing in.
      </p>
    </FieldGroup>
  )
}
