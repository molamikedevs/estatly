import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { TextFieldProps } from "@/types/global"
import type { FieldValues } from "react-hook-form"
import ControlledField from "./ControlledField"

export default function TextField<T extends FieldValues>({
  placeholder,
  type = "text",
  icon: Icon,
  autoComplete,
  ...fieldProps
}: TextFieldProps<T>) {
  return (
    <ControlledField {...fieldProps}>
      {(field, fieldState) => (
        <div className="relative">
          {Icon && <Icon className="icon-class" />}
          <Input
            {...field}
            id={fieldProps.id}
            type={type}
            placeholder={placeholder}
            autoComplete={autoComplete}
            className={cn("h-10", Icon && "pl-9")}
            aria-invalid={fieldState.invalid}
          />
        </div>
      )}
    </ControlledField>
  )
}
