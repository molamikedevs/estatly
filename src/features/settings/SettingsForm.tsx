import IconField from "@/components/form-components/IconField"
import SelectField from "@/components/form-components/SelectField"
import SpinnerMini from "@/components/SpinnerMini"
import { Button } from "@/components/ui/button"
import { durationOptions } from "@/lib/constants"
import type { Settings } from "@/types/database"
import { Building2, Clock, Mail, Percent, Phone } from "lucide-react"
import type { ReactNode } from "react"
import { useSettingsForm } from "./useSettingsForm"

// One section: what it is on the left, the fields on the right
function SettingsSection({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <section className="grid gap-4 p-5 sm:p-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-10">
      <div>
        <h2 className="font-medium">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="min-w-0 space-y-5">{children}</div>
    </section>
  )
}

export default function SettingsForm({ settings }: { settings: Settings }) {
  const { form, isPending, onSubmit } = useSettingsForm({ settings })
  const { control, formState, reset } = form

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="divide-y rounded-xl border bg-card">
        <SettingsSection
          title="Agency"
          description="Your agency's name and how clients reach the office."
        >
          <IconField
            control={control}
            name="name"
            id="agency-name"
            label="Agency name"
            icon={Building2}
            required
          />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <IconField
              control={control}
              name="contact_email"
              id="agency-email"
              label="Contact email"
              icon={Mail}
              type="email"
              placeholder="office@agency.ae"
              optional
            />
            <IconField
              control={control}
              name="contact_phone"
              id="agency-phone"
              label="Contact phone"
              icon={Phone}
              type="tel"
              placeholder="+971 4 000 0000"
              optional
            />
          </div>
        </SettingsSection>

        <SettingsSection
          title="Commission"
          description="Used to estimate the agency's earnings on each listing. Prices are in AED."
        >
          <div className="sm:max-w-48">
            <IconField
              control={control}
              name="commission_rate"
              id="commission-rate"
              label="Rate (%)"
              icon={Percent}
              type="number"
              placeholder="2"
              required
            />
          </div>
        </SettingsSection>

        <SettingsSection
          title="Viewings"
          description="How long a new viewing lasts by default. It can still be changed when scheduling."
        >
          <div className="sm:max-w-48">
            <SelectField
              control={control}
              name="default_viewing_duration"
              id="viewing-duration"
              label="Default length"
              icon={Clock}
              options={durationOptions}
              required
            />
          </div>
        </SettingsSection>
      </div>

      {/* Appears only when something changed. Sticky so it stays in reach on long screens,
          and above the phone tab bar. */}
      {formState.isDirty && (
        <div className="sticky bottom-[calc(5rem+env(safe-area-inset-bottom))] mt-4 flex animate-in items-center justify-between gap-3 rounded-xl border bg-card p-3 pl-4 shadow-lg fade-in slide-in-from-bottom-2 md:bottom-4">
          <p className="text-sm text-muted-foreground">Unsaved changes</p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              disabled={isPending}
              onClick={() => reset()}
            >
              Discard
            </Button>
            <Button type="submit" disabled={isPending} className="gap-2">
              {isPending && <SpinnerMini size="sm" />}
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </div>
      )}
    </form>
  )
}
