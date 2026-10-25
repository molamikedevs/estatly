import { Input } from "@/components/ui/input"
import type { PasswordFieldProps } from "@/types/global"
import { Lock } from "lucide-react"
import { useState } from "react"
import type { FieldValues } from "react-hook-form"
import ControlledField from "./ControlledField"
import PasswordToggle from "./PasswordToggle"

export default function PasswordField<T extends FieldValues>({
  placeholder,
  autoComplete = "new-password",
  ...fieldProps
}: PasswordFieldProps<T>) {
  const [visible, setVisible] = useState(false)

  return (
    <ControlledField {...fieldProps}>
      {(field, fieldState) => (
        <div className="relative">
          <Lock className="icon-class" />
          <Input
            {...field}
            id={fieldProps.id}
            type={visible ? "text" : "password"}
            placeholder={placeholder}
            autoComplete={autoComplete}
            className="h-10 pr-10 pl-9"
            aria-invalid={fieldState.invalid}
          />
          <PasswordToggle
            visible={visible}
            onToggle={() => setVisible((v) => !v)}
          />
        </div>
      )}
    </ControlledField>
  )
}
