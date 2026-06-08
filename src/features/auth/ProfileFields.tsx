import IconField from "@/components/form-components/IconField"
import PasswordField from "@/components/form-components/PasswordField"
import TextareaField from "@/components/form-components/TextareaField"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useProfileFields } from "@/features/auth/useProfileFields"
import type { UserFormValues } from "@/types/global"
import {
  Briefcase,
  KeyRound,
  Lock,
  Mail,
  Phone,
  User as UserIcon,
  X,
} from "lucide-react"
import { type Control, type UseFormSetValue } from "react-hook-form"

interface UserFieldsProps {
  control: Control<UserFormValues>
  setValue: UseFormSetValue<UserFormValues>
  email: string
}

export default function ProfileFields({
  control,
  setValue,
  email,
}: UserFieldsProps) {
  const { showPasswordSection, togglePasswordSection, bio } = useProfileFields({
    control,
    setValue,
  })

  return (
    <FieldGroup className="space-y-5">
      <IconField
        control={control}
        name="full_name"
        id="profile-fullName"
        label="Full name"
        icon={UserIcon}
        placeholder="Jane Doe"
        required
      />

      {/* Email — read-only */}
      <Field>
        <FieldLabel
          htmlFor="profile-email"
          className="text-xs font-medium text-muted-foreground"
        >
          Email address
        </FieldLabel>
        <div className="relative">
          <Mail className="icon-class" />
          <Input
            id="profile-email"
            type="email"
            value={email}
            disabled
            className="h-10 cursor-not-allowed pr-10 pl-9 opacity-70"
          />
          <Lock className="pointer-events-none absolute top-1/2 right-3 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        </div>
        <FieldDescription className="text-xs">
          Email can&apos;t be changed from this page
        </FieldDescription>
      </Field>

      <IconField
        control={control}
        name="phone"
        id="profile-phone"
        label="Phone number"
        icon={Phone}
        type="tel"
        placeholder="+234 800 000 0000"
        optional
      />

      <IconField
        control={control}
        name="specialization"
        id="profile-specialization"
        label="Specialization"
        icon={Briefcase}
        placeholder="e.g. Residential sales, Commercial leasing"
        optional
      />

      {/* Bio — has a live character counter, so kept inline */}

      <TextareaField
        control={control}
        name="bio"
        id="profile-bio"
        label="Bio"
        placeholder="A short introduction shown on your public profile"
        maxLength={bio.max}
        optional
      />

      {/* ── Password section ───────────────────────────── */}
      <div className="-mx-1 border-t border-border/60 pt-5">
        {!showPasswordSection ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={togglePasswordSection}
            className="gap-2"
          >
            <KeyRound className="h-3.5 w-3.5" />
            Change password
          </Button>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Change password</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Leave blank to keep your current password
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={togglePasswordSection}
                aria-label="Close password section"
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <PasswordField
              control={control}
              name="password"
              id="profile-password"
              label="New password"
              placeholder="At least 8 characters"
            />

            <PasswordField
              control={control}
              name="confirmPassword"
              id="profile-confirmPassword"
              label="Confirm new password"
              placeholder="Re-enter password"
            />
          </div>
        )}
      </div>
    </FieldGroup>
  )
}
