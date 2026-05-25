import type { LucideIcon } from "lucide-react"
import type { HTMLInputTypeAttribute, ReactNode } from "react"
import type {
  Control,
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Path,
} from "react-hook-form"
import { z } from "zod"

import { profileSchema, propertySchema } from "@/lib/validation"
import type { UserRole } from "./database"

// ─── Form Value Types (inferred from Zod) ─────────────

export type PropertyFormValues = z.infer<typeof propertySchema>
export type ProfileFormValues = z.infer<typeof profileSchema>

export interface CreateAgentFormValues {
  full_name: string
  email: string
  password: string
  role: Exclude<UserRole, "admin">
}

// Used by the update-profile API/hook
export interface UpdateDataProps {
  full_name?: string
  password?: string
  avatar?: File
  bio?: string
  specialization?: string
  phone?: string
}

// ─── Shared Field Primitives ──────────────────────────

export interface SelectOption {
  value: string
  label: string
}

export interface FieldLabelTextProps {
  children: ReactNode
  required?: boolean
  optional?: boolean
}

// ─── Form Component Props ─────────────────────────────

export interface PasswordFieldProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  id: string
  label: string
  placeholder?: string
  autoComplete?: string
  required?: boolean
  description?: ReactNode
  labelAddon?: ReactNode
}

export interface IconFieldProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  id: string
  label: string
  icon: LucideIcon
  placeholder?: string
  type?: HTMLInputTypeAttribute
  autoComplete?: string
  required?: boolean
  optional?: boolean
}

export interface SelectFieldProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  id: string
  label: string
  options: SelectOption[]
  placeholder?: string
  icon?: LucideIcon
  required?: boolean
  optional?: boolean
}

export interface TagFieldProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  description?: ReactNode
  placeholder?: string
}

export interface ControlledFieldProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  id: string
  label: string
  required?: boolean
  optional?: boolean
  children: (
    field: ControllerRenderProps<T, Path<T>>,
    fieldState: ControllerFieldState
  ) => ReactNode
}

export interface AgentFieldsProps {
  control: Control<CreateAgentFormValues>
}

export type TextareaFieldProps<T extends FieldValues> = Omit<
  ControlledFieldProps<T>,
  "children"
> & {
  placeholder?: string
  rows?: number
  maxLength?: number
}

export type TextFieldProps<T extends FieldValues> = Omit<
  ControlledFieldProps<T>,
  "children"
> & {
  placeholder?: string
  type?: string
}

export interface SwitchFieldProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  id: string
  label: string
  description?: string
}
