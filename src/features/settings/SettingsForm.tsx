import PageSection from "@/components/form-components/PageSection"
import SaveBar from "@/components/form-components/SaveBar"
import SelectField from "@/components/form-components/SelectField"
import TextField from "@/components/form-components/TextField"
import { durationOptions } from "@/lib/constants"
import type { Settings } from "@/types/database"
import { Building2, Clock, Mail, Percent, Phone } from "lucide-react"
import { useSettingsForm } from "./useSettingsForm"

export default function SettingsForm({ settings }: { settings: Settings }) {
  const { form, isPending, onSubmit } = useSettingsForm({ settings })
  const { control, formState, reset } = form

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="divide-y rounded-xl border bg-card">
        <PageSection
          title="Agency"
          description="Your agency's name and how clients reach the office."
        >
          <TextField
            control={control}
            name="name"
            id="agency-name"
            label="Agency name"
            icon={Building2}
            required
          />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <TextField
              control={control}
              name="contact_email"
              id="agency-email"
              label="Contact email"
              icon={Mail}
              type="email"
              placeholder="office@agency.ae"
              optional
            />
            <TextField
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
        </PageSection>

        <PageSection
          title="Commission"
          description="Used to estimate the agency's earnings on each listing. Prices are in AED."
        >
          <div className="sm:max-w-48">
            <TextField
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
        </PageSection>

        <PageSection
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
        </PageSection>
      </div>

      {formState.isDirty && (
        <SaveBar isPending={isPending} onDiscard={() => reset()} />
      )}
    </form>
  )
}
