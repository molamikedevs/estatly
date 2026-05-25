import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import type { TagFieldProps } from "@/types/global"
import { Controller, type FieldValues } from "react-hook-form"
import FieldLabelText from "./FieldLabelText"
import TagInput from "./TagInput"

export default function TagField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  placeholder,
}: TagFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Field>
          <FieldLabel>
            <FieldLabelText>{label}</FieldLabelText>
          </FieldLabel>
          {description && (
            <FieldDescription className="text-xs">
              {description}
            </FieldDescription>
          )}
          <TagInput
            value={field.value}
            onChange={field.onChange}
            placeholder={placeholder}
          />
        </Field>
      )}
    />
  )
}
