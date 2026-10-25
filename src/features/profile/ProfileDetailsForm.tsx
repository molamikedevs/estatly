import IconField from "@/components/form-components/IconField"
import PageSection from "@/components/form-components/PageSection"
import SaveBar from "@/components/form-components/SaveBar"
import { profileFormSchema, type ProfileFormValues } from "@/lib/validation"
import type { UserProfile } from "@/types/database"
import { zodResolver } from "@hookform/resolvers/zod"
import { Briefcase, Phone, User as UserIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { useUpdateProfile } from "./useUpdateProfile"

// Database values (nulls) → form values (strings)
function toFormValues(profile: UserProfile): ProfileFormValues {
  return {
    full_name: profile.full_name ?? "",
    phone: profile.phone ?? "",
    specialization: profile.specialization ?? "",
  }
}

export default function ProfileDetailsForm({
  profile,
}: {
  profile: UserProfile
}) {
  const { updateProfile, isPending } = useUpdateProfile()

  const { control, handleSubmit, reset, formState } =
    useForm<ProfileFormValues>({
      resolver: zodResolver(profileFormSchema),
      mode: "onTouched",
      defaultValues: toFormValues(profile),
    })

  const onSubmit = handleSubmit((values) => {
    // The saved values become the new starting point, so the save bar hides
    updateProfile(values, { onSuccess: () => reset(values) })
  })

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="rounded-xl border bg-card">
        <PageSection
          title="Details"
          description="Shown to your team on cards and lists. Your email and role are set by your admin."
        >
          <IconField
            control={control}
            name="full_name"
            id="profile-name"
            label="Full name"
            icon={UserIcon}
            autoComplete="name"
            required
          />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <IconField
              control={control}
              name="phone"
              id="profile-phone"
              label="Phone"
              icon={Phone}
              type="tel"
              autoComplete="tel"
              placeholder="+971 50 000 0000"
              optional
            />
            <IconField
              control={control}
              name="specialization"
              id="profile-specialization"
              label="Specialization"
              icon={Briefcase}
              placeholder="Residential sales"
              optional
            />
          </div>
        </PageSection>
      </div>

      {formState.isDirty && (
        <SaveBar isPending={isPending} onDiscard={() => reset()} />
      )}
    </form>
  )
}
