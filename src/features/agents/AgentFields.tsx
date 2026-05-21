import IconField from "@/components/form-components/IconField"
import PasswordField from "@/components/form-components/PasswordField"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { AgentFieldsProps } from "@/types/form-types"

import { Mail, ShieldCheck, User as UserIcon } from "lucide-react"
import { Controller } from "react-hook-form"

export default function AgentFields({ control }: AgentFieldsProps) {
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
        placeholder="agent@agency.com"
        autoComplete="off"
        required
      />

      {/* Role — select, kept inline */}
      <Controller
        control={control}
        name="role"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="agent-role">
              Role <span className="text-destructive">*</span>
            </FieldLabel>
            <div className="relative">
              <ShieldCheck className={`icon-class z-10`} />
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id="agent-role"
                  className="h-10 pl-9"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agent">Agent</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
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
