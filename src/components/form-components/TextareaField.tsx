import { Textarea } from "@/components/ui/textarea"
import type { TextareaFieldProps } from "@/types/global"
import type { FieldValues } from "react-hook-form"
import ControlledField from "./ControlledField"

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
    <ControlledField
      control={control}
      name={name}
      id={id}
      label={label}
      required={required}
      optional={optional}
    >
      {(field, fieldState) => (
        <>
          {maxLength && (
            <div className="mb-2 flex justify-end">
              <span className="text-[10px] text-muted-foreground tabular-nums">
                {(field.value ?? "").length}/{maxLength}
              </span>
            </div>
          )}

          <Textarea
            {...field}
            id={id}
            rows={rows}
            placeholder={placeholder}
            className="resize-none"
            aria-invalid={fieldState.invalid}
          />
        </>
      )}
    </ControlledField>
  )
}
