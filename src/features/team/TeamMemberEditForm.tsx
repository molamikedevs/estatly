import { FormFooter } from "@/components/form-components/FormFooter"
import IconField from "@/components/form-components/IconField"
import {
  teamMemberFormSchema,
  type TeamMemberFormValues,
} from "@/lib/validation"
import type { TeamMember } from "@/types/database"
import { zodResolver } from "@hookform/resolvers/zod"
import { Briefcase, Phone, User as UserIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { useUpdateTeamMember } from "./useUpdateTeamMember"

interface TeamMemberEditFormProps {
  member: TeamMember
  onClose: () => void
}

export default function TeamMemberEditForm({
  member,
  onClose,
}: TeamMemberEditFormProps) {
  const { updateMember, isPending } = useUpdateTeamMember()

  const { control, handleSubmit } = useForm<TeamMemberFormValues>({
    resolver: zodResolver(teamMemberFormSchema),
    mode: "onTouched",
    defaultValues: {
      full_name: member.full_name ?? "",
      phone: member.phone ?? "",
      specialization: member.specialization ?? "",
    },
  })

  const onSubmit = handleSubmit((values) => {
    updateMember({ userId: member.user_id, values }, { onSuccess: onClose })
  })

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex flex-1 flex-col overflow-hidden"
    >
      <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
        {/* Email is their sign-in, so it is shown but not editable */}
        <div className="rounded-lg bg-muted p-3 text-sm">
          <p className="text-muted-foreground">Signs in with</p>
          <p className="truncate font-medium">{member.email}</p>
        </div>

        <IconField
          control={control}
          name="full_name"
          id="member-name"
          label="Full name"
          icon={UserIcon}
          required
        />
        <IconField
          control={control}
          name="phone"
          id="member-phone"
          label="Phone"
          icon={Phone}
          type="tel"
          placeholder="+971 50 000 0000"
          optional
        />
        <IconField
          control={control}
          name="specialization"
          id="member-specialization"
          label="Specialization"
          icon={Briefcase}
          placeholder="Residential sales"
          optional
        />
      </div>

      <FormFooter
        canSave={!isPending}
        isSubmitting={isPending}
        onCancel={onClose}
        submitLabel="Save changes"
        submittingLabel="Saving..."
      />
    </form>
  )
}
