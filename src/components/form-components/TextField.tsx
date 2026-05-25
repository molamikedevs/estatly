import { Input } from "@/components/ui/input"
import type { TextFieldProps } from "@/types/global"
import type { FieldValues } from "react-hook-form"
import ControlledField from "./ControlledField"

export default function TextField<T extends FieldValues>({
  placeholder,
  type = "text",
  ...fieldProps
}: TextFieldProps<T>) {
  return (
    <ControlledField {...fieldProps}>
      {(field, fieldState) => (
        <Input
          {...field}
          id={fieldProps.id}
          type={type}
          placeholder={placeholder}
          aria-invalid={fieldState.invalid}
        />
      )}
    </ControlledField>
  )
}
