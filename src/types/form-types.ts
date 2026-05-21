import type { LucideIcon } from "lucide-react"
import { type HTMLInputTypeAttribute, type ReactNode } from "react"

import { type Control, type FieldValues, type Path } from "react-hook-form"

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

export interface FieldLabelTextProps {
  children: ReactNode
  required?: boolean
  optional?: boolean
}

export type UserRole = "admin" | "manager" | "agent"

export interface CreateAgentFormValues {
  full_name: string
  email: string
  password: string
  role: Exclude<UserRole, "admin">
}

export interface AgentFieldsProps {
  control: Control<CreateAgentFormValues>
}
