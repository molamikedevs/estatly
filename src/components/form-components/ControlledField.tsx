import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import type { ControlledFieldProps } from "@/types/global"
import type { ReactNode } from "react"
import {
  Controller,
  type ControllerFieldState,
  type ControllerRenderProps,
  type FieldValues,
  type Path,
} from "react-hook-form"
import FieldLabelText from "./FieldLabelText"

/**
 * Shared scaffold for a single controlled form field: the Controller,
 * the label, and error display. The caller renders only the control
 * itself, via the children render-prop.
 */
export default function ControlledField<T extends FieldValues>({
  control,
  name,
  id,
  label,
  required,
  optional,
  children,
}: ControlledFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={id}>
            <FieldLabelText required={required} optional={optional}>
              {label}
            </FieldLabelText>
          </FieldLabel>
          {children(field, fieldState)}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}

/** Re-exported for convenience when typing a children render-prop. */
export type ControlledFieldRender<T extends FieldValues> = (
  field: ControllerRenderProps<T, Path<T>>,
  fieldState: ControllerFieldState
) => ReactNode
