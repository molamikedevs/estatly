import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { TextareaFieldProps } from "@/types/global"
import type { FieldValues } from "react-hook-form"
import ControlledField from "./ControlledField"

export default function TextareaField<T extends FieldValues>({
  placeholder,
  rows = 4,
  maxLength,
  ...fieldProps
}: TextareaFieldProps<T>) {
  return (
    <ControlledField {...fieldProps}>
      {(field, fieldState) => {
        const length = (field.value ?? "").length
        const nearLimit = maxLength && length >= maxLength * 0.9

        return (
          <div className="space-y-1.5">
            <Textarea
              {...field}
              id={fieldProps.id}
              rows={rows}
              placeholder={placeholder}
              maxLength={maxLength}
              className="resize-none"
              aria-invalid={fieldState.invalid}
            />
            {maxLength && (
              <p
                className={cn(
                  "text-right text-[10px] tabular-nums",
                  nearLimit ? "text-warning" : "text-muted-foreground"
                )}
              >
                {length}/{maxLength}
              </p>
            )}
          </div>
        )
      }}
    </ControlledField>
  )
}
