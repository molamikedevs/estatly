import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
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
 * the label (with an optional addon on the same row), an optional
 * description and error display. The caller renders only the control.
 */
export default function ControlledField<T extends FieldValues>({
  control,
  name,
  id,
  label,
  required,
  optional,
  description,
  labelAddon,
  children,
}: ControlledFieldProps<T>) {
  const labelEl = (
    <FieldLabel htmlFor={id}>
      <FieldLabelText required={required} optional={optional}>
        {label}
      </FieldLabelText>
    </FieldLabel>
  )

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {labelAddon ? (
            <div className="flex items-center justify-between">
              {labelEl}
              {labelAddon}
            </div>
          ) : (
            labelEl
          )}

          {children(field, fieldState)}

          {description && (
            <FieldDescription className="text-xs">
              {description}
            </FieldDescription>
          )}
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
