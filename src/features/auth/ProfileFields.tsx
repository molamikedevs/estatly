import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { ProfileFormValues } from "@/types/index"
import { Briefcase, Lock, Mail, Phone, User as UserIcon } from "lucide-react"
import type { Control } from "react-hook-form"
import { Controller, useWatch } from "react-hook-form"

const BIO_MAX = 280

interface ProfileFieldsProps {
  control: Control<ProfileFormValues>
  email: string
}

export default function ProfileFields({ control, email }: ProfileFieldsProps) {
  const bioValue = useWatch({ control, name: "bio" }) ?? ""

  return (
    <FieldGroup className="space-y-5">
      {/* Full name */}
      <Controller
        control={control}
        name="fullName"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="profile-fullName">
              Full name <span className="text-destructive">*</span>
            </FieldLabel>
            <div className="relative">
              <UserIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                {...field}
                id="profile-fullName"
                placeholder="Jane Doe"
                className="h-10 pl-9"
                aria-invalid={fieldState.invalid}
              />
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Email — read-only, outside schema */}
      <Field>
        <FieldLabel
          htmlFor="profile-email"
          className="text-xs font-medium text-muted-foreground"
        >
          Email address
        </FieldLabel>
        <div className="relative">
          <Mail className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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

      {/* Phone */}
      <Controller
        control={control}
        name="phone"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="profile-phone">
              Phone number{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </FieldLabel>
            <div className="relative">
              <Phone className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                {...field}
                id="profile-phone"
                type="tel"
                placeholder="+234 800 000 0000"
                className="h-10 pl-9"
                aria-invalid={fieldState.invalid}
              />
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Specialization */}
      <Controller
        control={control}
        name="specialization"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="profile-specialization">
              Specialization{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </FieldLabel>
            <div className="relative">
              <Briefcase className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                {...field}
                id="profile-specialization"
                placeholder="e.g. Residential sales, Commercial leasing"
                className="h-10 pl-9"
                aria-invalid={fieldState.invalid}
              />
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Bio */}
      <Controller
        control={control}
        name="bio"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="profile-bio">
                Bio{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </FieldLabel>
              <span
                className={
                  bioValue.length > BIO_MAX - 20
                    ? "text-[10px] text-warning tabular-nums"
                    : "text-[10px] text-muted-foreground tabular-nums"
                }
              >
                {bioValue.length}/{BIO_MAX}
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
    </FieldGroup>
  )
}
