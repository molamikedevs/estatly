import {
  createTeamMemberSchema,
  type CreateTeamMemberValues,
} from "@/lib/validation"
import type { CreatableRole } from "@/types/database"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useCreateTeamMember } from "./useCreateTeamMember"

interface UseTeamMemberCreateFormParams {
  role: CreatableRole
  onClose: () => void
}

export function useTeamMemberCreateForm({
  role,
  onClose,
}: UseTeamMemberCreateFormParams) {
  const { createMember, isPending } = useCreateTeamMember(role)

  const form = useForm<CreateTeamMemberValues>({
    resolver: zodResolver(createTeamMemberSchema),
    mode: "onTouched",
    // role is fixed by the page; there is no field for it
    defaultValues: { full_name: "", email: "", password: "", role },
  })

  const onSubmit = form.handleSubmit((values) => {
    createMember(values, { onSuccess: onClose })
  })

  return { form, isPending, onSubmit }
}
