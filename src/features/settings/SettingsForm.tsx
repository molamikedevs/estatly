import IconField from "@/components/form-components/IconField"
import SelectField from "@/components/form-components/SelectField"
import { FieldGroup } from "@/components/ui/field"
import { currencyOptions } from "@/lib/constants"
import type { Settings } from "@/types/database"
import { Building2, Coins, Mail, Percent, Phone } from "lucide-react"
import { FormFooter } from "../auth/FormFooter"
import { useSettingsForm } from "./useSettingsForm"

export default function SettingsForm({ settings }: { settings: Settings }) {
  const { form, isPending, onSubmit } = useSettingsForm({ settings })
  const { control, formState, reset } = form

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-2xl space-y-5">
      {/* ── Agency profile ──────────────────────── */}
      <section className="rounded-2xl border bg-card p-5 shadow-card sm:p-6">
        <div className="mb-5 flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Building2 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Agency profile</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Your agency's identity and contact details
            </p>
          </div>
        </div>

        <FieldGroup className="space-y-4">
          <IconField
            control={control}
            name="name"
            id="name"
            label="Agency name"
            icon={Building2}
            placeholder="Your agency"
            required
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <IconField
              control={control}
              name="contact_email"
              id="contact_email"
              label="Contact email"
              icon={Mail}
              type="email"
              placeholder="contact@agency.com"
              optional
            />
            <IconField
              control={control}
              name="contact_phone"
              id="contact_phone"
              label="Contact phone"
              icon={Phone}
              type="tel"
              placeholder="+971 50 000 0000"
              optional
            />
          </div>
        </FieldGroup>
      </section>

      {/* ── Operational defaults ────────────────── */}
      <section className="rounded-2xl border bg-card p-5 shadow-card sm:p-6">
        <div className="mb-5 flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Percent className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Operational defaults</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Values applied across listings and transactions
            </p>
          </div>
        </div>

        <FieldGroup className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <IconField
              control={control}
              name="commission_rate"
              id="commission_rate"
              label="Commission rate (%)"
              icon={Percent}
              type="number"
              placeholder="2.5"
              required
            />
            <SelectField
              control={control}
              name="default_currency"
              id="default_currency"
              label="Default currency"
              icon={Coins}
              options={currencyOptions}
              required
            />
          </div>
        </FieldGroup>
      </section>

      <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border bg-card shadow-card">
        <FormFooter
          canSave={!isPending && formState.isDirty}
          isSubmitting={isPending}
          onCancel={() => reset()}
          submitLabel="Save changes"
          submittingLabel="Saving…"
        />
      </div>
    </form>
  )
}
