import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import type { TextareaFieldProps } from "@/types/global"
import type { FieldValues } from "react-hook-form"
import { Controller } from "react-hook-form"
import FieldLabelText from "./FieldLabelText"

export default function TextareaField<T extends FieldValues>({
  control,
  name,
  id,
  label,
  required,
  optional,
  placeholder,
  rows = 4,
  maxLength,
}: TextareaFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor={id}>
              <FieldLabelText required={required} optional={optional}>
                {label}
              </FieldLabelText>
            </FieldLabel>
            {maxLength && (
              <span className="text-[10px] text-muted-foreground tabular-nums">
                {(field.value ?? "").length}/{maxLength}
              </span>
            )}
          </div>
          <Textarea
            {...field}
            id={id}
            rows={rows}
            placeholder={placeholder}
            className="resize-none"
            aria-invalid={fieldState.invalid}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
