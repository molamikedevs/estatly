import IconField from "@/components/form-components/IconField"
import SelectField from "@/components/form-components/SelectField"
import TagField from "@/components/form-components/TagField"
import { FieldGroup } from "@/components/ui/field"
import { useClientForm } from "@/features/clients/useClientForm"
import { propertyTypes } from "@/lib/constants"
import { DollarSign, Globe, Mail, Phone, User as UserIcon } from "lucide-react"
import { FormFooter } from "../../components/form-components/FormFooter"

import { CLIENT_STATUS_OPTIONS } from "@/lib/constants"

interface ClientFormProps {
  onClose: () => void
}

export default function ClientForm({ onClose }: ClientFormProps) {
  const { form, isPending, onSubmit } = useClientForm({ onClose })
  const { control } = form

  return (
    <form onSubmit={onSubmit} className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 scrollbar-thin space-y-6 overflow-y-auto px-6 py-6">
        {/* Contact */}
        <FieldGroup className="space-y-5">
          <p className="text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
            Contact details
          </p>
          <IconField
            control={control}
            name="full_name"
            id="full_name"
            label="Full name"
            icon={UserIcon}
            placeholder="Omar Al-Rashid"
            required
          />
          <IconField
            control={control}
            name="email"
            id="email"
            label="Email"
            icon={Mail}
            type="email"
            placeholder="client@email.com"
            required
          />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <IconField
              control={control}
              name="phone"
              id="phone"
              label="Phone"
              icon={Phone}
              type="tel"
              placeholder="+971 50 000 0000"
              optional
            />
            <IconField
              control={control}
              name="nationality"
              id="nationality"
              label="Nationality"
              icon={Globe}
              placeholder="Emirati"
              optional
            />
          </div>
        </FieldGroup>

        {/* Preferences */}
        <FieldGroup className="space-y-5 border-t border-border/60 pt-6">
          <p className="text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
            Requirements
          </p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <IconField
              control={control}
              name="budget_min"
              id="budget_min"
              label="Budget min (AED)"
              icon={DollarSign}
              type="number"
              placeholder="500000"
              optional
            />
            <IconField
              control={control}
              name="budget_max"
              id="budget_max"
              label="Budget max (AED)"
              icon={DollarSign}
              type="number"
              placeholder="2000000"
              optional
            />
          </div>
          <SelectField
            control={control}
            name="preferred_type"
            id="preferred_type"
            label="Preferred property type"
            options={propertyTypes}
            placeholder="Any type"
            optional
          />
          <TagField
            control={control}
            name="preferred_locations"
            label="Preferred locations"
            description="Areas the client is interested in"
            placeholder="Add a location and press Enter"
          />
          <SelectField
            control={control}
            name="status"
            id="status"
            label="Status"
            options={CLIENT_STATUS_OPTIONS}
          />
        </FieldGroup>
      </div>

      <FormFooter
        canSave={!isPending}
        isSubmitting={isPending}
        onCancel={onClose}
        submitLabel="Add client"
        submittingLabel="Adding…"
      />
    </form>
  )
}
