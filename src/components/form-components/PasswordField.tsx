import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { PasswordFieldProps } from "@/types/global"
import { Lock } from "lucide-react"
import { useState } from "react"
import { Controller, type FieldValues } from "react-hook-form"
import FieldLabelText from "./FieldLabelText"
import PasswordToggle from "./PasswordToggle"

export default function PasswordField<T extends FieldValues>({
  control,
  name,
  id,
  label,
  placeholder,
  autoComplete = "new-password",
  required,
  description,
  labelAddon,
}: PasswordFieldProps<T>) {
  const [visible, setVisible] = useState(false)

  const labelEl = (
    <FieldLabel htmlFor={id}>
      <FieldLabelText required={required}>{label}</FieldLabelText>
    </FieldLabel>
  )

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {/* When a labelAddon is passed (e.g. a "Forgot password?" link),
              render the label and addon on the same row. */}
          {labelAddon ? (
            <div className="flex items-center justify-between">
              {labelEl}
              {labelAddon}
            </div>
          ) : (
            labelEl
          )}

          <div className="relative">
            <Lock className="icon-class" />
            <Input
              {...field}
              id={id}
              type={visible ? "text" : "password"}
              placeholder={placeholder}
              autoComplete={autoComplete}
              className="h-10 pr-10 pl-9"
              aria-invalid={fieldState.invalid}
            />

            <PasswordToggle
              visible={visible}
              onToggle={() => setVisible((v) => !v)}
            />
          </div>

          {description && (
            <FieldDescription className="text-xs">
              {description}
            </FieldDescription>
          )}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
