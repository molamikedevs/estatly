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
        <div className="relative min-w-0">
          {Icon && <Icon className="icon-class z-10" />}
          <Select
            value={field.value}
            onValueChange={field.onChange}
            // Closing the list counts as leaving the field, so errors can show
            onOpenChange={(open) => !open && field.onBlur()}
          >
            <SelectTrigger
              id={id}
              className={Icon ? "w-full pl-9" : "w-full"}
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
