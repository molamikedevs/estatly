import { useCreateTeam } from "@/features/team/useCreateTeam"
import { createAgentSchema } from "@/lib/validation"
import type { CreatableRole } from "@/types/database"
import type { CreateAgentFormValues } from "@/types/global"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

interface UserFormProps {
  onClose: () => void
  role: CreatableRole
}

export function useTeamForm({ onClose, role }: UserFormProps) {
  const { createTeam, isPending } = useCreateTeam(role)

  const form = useForm<CreateAgentFormValues>({
    resolver: zodResolver(createAgentSchema),
    mode: "onTouched",
    // role is fixed by the page; there is no field for it
    defaultValues: { full_name: "", email: "", password: "", role },
  })

  const onSubmit = form.handleSubmit((values) => {
    createTeam(values, { onSuccess: onClose })
  })

  return { form, isPending, onSubmit }
}
