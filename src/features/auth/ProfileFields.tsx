import FieldLabelText from "@/components/form-components/FieldLabelText"
import IconField from "@/components/form-components/IconField"
import PasswordField from "@/components/form-components/PasswordField"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useProfileFields } from "@/hooks/form/useProfileFields"
import type { ProfileFormValues } from "@/types/index"
import {
  Briefcase,
  KeyRound,
  Lock,
  Mail,
  Phone,
  User as UserIcon,
  X,
} from "lucide-react"
import { Controller, type Control, type UseFormSetValue } from "react-hook-form"

interface ProfileFieldsProps {
  control: Control<ProfileFormValues>
  setValue: UseFormSetValue<ProfileFormValues>
  email: string
}

export default function ProfileFields({
  control,
  setValue,
  email,
}: ProfileFieldsProps) {
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
      <Controller
        control={control}
        name="bio"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="profile-bio">
                <FieldLabelText optional>Bio</FieldLabelText>
              </FieldLabel>
              <span
                className={
                  bio.isNearLimit
                    ? "text-[10px] text-warning tabular-nums"
                    : "text-[10px] text-muted-foreground tabular-nums"
                }
              >
                {bio.length}/{bio.max}
              </span>
            </div>
            <Textarea
              {...field}
              id="profile-bio"
              placeholder="A short introduction shown on your public profile"
              rows={4}
              className="resize-none"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
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
