import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"
import type { SwitchFieldProps } from "@/types/global"
import type { FieldValues } from "react-hook-form"
import { Controller } from "react-hook-form"
import FieldLabelText from "./FieldLabelText"

export default function SwitchField<T extends FieldValues>({
  control,
  name,
  id,
  label,
  description,
}: SwitchFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Field
          orientation="horizontal"
          className="justify-between rounded-lg border border-border/60 bg-muted/30 px-4 py-3"
        >
          <div>
            <FieldLabel htmlFor={id}>
              <FieldLabelText>{label}</FieldLabelText>
            </FieldLabel>
            {description && (
              <FieldDescription className="text-xs">
                {description}
              </FieldDescription>
            )}
          </div>
          <Switch
            id={id}
            checked={field.value}
            onCheckedChange={field.onChange}
          />
        </Field>
      )}
    />
  )
}
