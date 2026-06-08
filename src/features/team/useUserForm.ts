import { useCreateUser } from "@/features/team/useCreateUser"
import { createAgentSchema } from "@/lib/validation"
import type { CreatableRole } from "@/types/database"
import type { CreateAgentFormValues } from "@/types/global"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

interface UserFormProps {
  onClose: () => void
  role: CreatableRole
}

export function useUserForm({ onClose, role }: UserFormProps) {
  const { createUser, isPending } = useCreateUser(role)

  const form = useForm<CreateAgentFormValues>({
    resolver: zodResolver(createAgentSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      role,
    },
  })

  const onSubmit = form.handleSubmit((values) => {
    createUser(values, {
      onSuccess: () => {
        form.reset()
        onClose()
      },
    })
  })

  function handleCancel() {
    form.reset()
    onClose()
  }

  const canSave = form.formState.isDirty && form.formState.isValid && !isPending

  return { form, canSave, handleCancel, isPending, onSubmit }
}
