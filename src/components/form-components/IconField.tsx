/* ────────────────────────────────────────────────────────────── IconField — a controlled text input with a leading icon
   ────────────────────────────────────────────────────────────── */

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { IconFieldProps } from "@/types/form-types"
import { Controller, type FieldValues } from "react-hook-form"
import FieldLabelText from "./FieldLabelText"

export default function IconField<T extends FieldValues>({
  control,
  name,
  id,
  label,
  icon: Icon,
  placeholder,
  type = "text",
  autoComplete,
  required,
  optional,
}: IconFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={id}>
            <FieldLabelText required={required} optional={optional}>
              {label}
            </FieldLabelText>
          </FieldLabel>
          <div className="relative">
            <Icon className="icon-class" />
            <Input
              {...field}
              id={id}
              type={type}
              placeholder={placeholder}
              autoComplete={autoComplete}
              className="h-10 pl-9"
              aria-invalid={fieldState.invalid}
            />
          </div>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
