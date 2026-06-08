import DisplayField from "@/components/form-components/DisplayField"
import { currencyOptions } from "@/lib/constants"
import type { Settings } from "@/types/database"
import { Building2, Coins, Mail, Percent, Phone } from "lucide-react"

function currencyLabel(value: string) {
  return currencyOptions.find((o) => o.value === value)?.label ?? value
}

/**
 * Read-only display of the current settings. Plain values via
 * DisplayField — no form, no inputs. Mirrors the profile "About" pattern.
 */
export default function SettingsDisplay({ settings }: { settings: Settings }) {
  return (
    <div className="space-y-5">
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

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <DisplayField
            icon={Building2}
            label="Agency name"
            value={settings.name}
          />
          <DisplayField
            icon={Mail}
            label="Contact email"
            value={settings.contact_email}
          />
          <DisplayField
            icon={Phone}
            label="Contact phone"
            value={settings.contact_phone}
          />
        </div>
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

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <DisplayField
            icon={Percent}
            label="Commission rate"
            value={
              settings.commission_rate != null
                ? `${settings.commission_rate}%`
                : null
            }
          />
          <DisplayField
            icon={Coins}
            label="Default currency"
            value={currencyLabel(settings.default_currency)}
          />
        </div>
      </section>
    </div>
  )
}
