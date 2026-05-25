import { Input } from "@/components/ui/input"
import type { IconFieldProps } from "@/types/global"
import type { FieldValues } from "react-hook-form"
import ControlledField from "./ControlledField"

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
    <ControlledField
      control={control}
      name={name}
      id={id}
      label={label}
      required={required}
      optional={optional}
    >
      {(field, fieldState) => (
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
      )}
    </ControlledField>
  )
}
