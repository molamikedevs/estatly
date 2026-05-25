import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { SelectFieldProps } from "@/types/global"
import type { FieldValues } from "react-hook-form"
import ControlledField from "./ControlledField"

export default function SelectField<T extends FieldValues>({
  control,
  name,
  id,
  label,
  options,
  placeholder = "Select",
  icon: Icon,
  required,
  optional,
}: SelectFieldProps<T>) {
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
          {Icon && <Icon className="icon-class z-10" />}
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger
              id={id}
              className={Icon ? "pl-9" : undefined}
              aria-invalid={fieldState.invalid}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </ControlledField>
  )
}
