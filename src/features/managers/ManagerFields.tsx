import IconField from "@/components/form-components/IconField"
import PasswordField from "@/components/form-components/PasswordField"
import SelectField from "@/components/form-components/SelectField"
import { FieldGroup } from "@/components/ui/field"
import { useUser } from "@/features/auth/useUser"
import { ROLE_OPTIONS } from "@/lib/constants"
import type { AgentFieldsProps } from "@/types/global"
import { Mail, ShieldCheck, User as UserIcon } from "lucide-react"

export default function ManagerFields({ control }: AgentFieldsProps) {
  const { user } = useUser()
  const role = user?.user_profile?.role
  const isAdmin = role === "admin"

  // Admins can assign any role; everyone else can only assign "agent".
  // This is a UI guardrail — the database must still enforce this.
  const roleOptions = isAdmin
    ? ROLE_OPTIONS
    : ROLE_OPTIONS.filter((o) => o.value === "manager")

  return (
    <FieldGroup className="space-y-5">
      <IconField
        control={control}
        name="full_name"
        id="agent-name"
        label="Full name"
        icon={UserIcon}
        placeholder="Molamike Devs"
        autoComplete="name"
        required
      />

      <IconField
        control={control}
        name="email"
        id="agent-email"
        label="Email address"
        icon={Mail}
        type="email"
        placeholder="jane@manager.com"
        autoComplete="off"
        required
      />

      <SelectField
        control={control}
        name="role"
        id="agent-role"
        label="Role"
        icon={ShieldCheck}
        options={roleOptions}
        placeholder="Select a role"
        required
      />

      <PasswordField
        control={control}
        name="password"
        id="agent-password"
        label="Temporary password"
        placeholder="At least 8 characters"
        required
      />

      <div className="rounded-lg border border-info/20 bg-info-muted px-3.5 py-2.5">
        <p className="text-xs text-info">
          Share these credentials with the agent securely. They can change their
          password after signing in.
        </p>
      </div>
    </FieldGroup>
  )
}
