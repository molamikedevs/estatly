import IconField from "@/components/form-components/IconField"
import PasswordField from "@/components/form-components/PasswordField"
import SelectField from "@/components/form-components/SelectField"
import { FieldGroup } from "@/components/ui/field"
import { ROLE_OPTIONS } from "@/lib/constants"
import type { CreatableRole } from "@/types/database"
import type { AgentFieldsProps } from "@/types/global"
import { Mail, ShieldCheck, User as UserIcon } from "lucide-react"

interface TeamMemberFieldsProps extends AgentFieldsProps {
  role: CreatableRole
}

export default function TeamMemberFields({
  control,
  role,
}: TeamMemberFieldsProps) {
  // (UI guardrail — the database must still enforce role assignment.)
  const roleOptions = ROLE_OPTIONS.filter((o) => o.value === role)

  const label = role === "manager" ? "manager" : "agent"
  const emailPlaceholder =
    role === "manager" ? "jane@manager.com" : "agent@agency.com"

  return (
    <FieldGroup className="space-y-5">
      <IconField
        control={control}
        name="full_name"
        id="user-name"
        label="Full name"
        icon={UserIcon}
        placeholder="Molamike Devs"
        autoComplete="name"
        required
      />

      <IconField
        control={control}
        name="email"
        id="user-email"
        label="Email address"
        icon={Mail}
        type="email"
        placeholder={emailPlaceholder}
        autoComplete="off"
        required
      />

      <SelectField
        control={control}
        name="role"
        id="user-role"
        label="Role"
        icon={ShieldCheck}
        options={roleOptions}
        placeholder="Select a role"
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

      <div className="rounded-lg border border-info/20 bg-info-muted px-3.5 py-2.5">
        <p className="text-xs text-info">
          Share these credentials with the {label} securely. They can change
          their password after signing in.
        </p>
      </div>
    </FieldGroup>
  )
}
