import { FormFooter } from "@/components/form-components/FormFooter"
import IconField from "@/components/form-components/IconField"
import SelectField from "@/components/form-components/SelectField"
import TagField from "@/components/form-components/TagField"
import { propertyTypes } from "@/lib/constants"
import type { ClientFormProps } from "@/types/database"
import { Banknote, Globe, Mail, Phone, User as UserIcon } from "lucide-react"
import { useClientForm } from "./useClientForm"

// One form for add and edit: both change the same fields
export default function ClientForm({ client, onClose }: ClientFormProps) {
  const { form, isEdit, isPending, onSubmit } = useClientForm({
    client,
    onClose,
  })
  const { control } = form

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex flex-1 flex-col overflow-hidden"
    >
      <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
        <section className="space-y-5">
          <h3 className="text-sm font-medium">Contact</h3>
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
        </section>

        <section className="space-y-5 border-t pt-6">
          <h3 className="text-sm font-medium">What they are looking for</h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <IconField
              control={control}
              name="budget_min"
              id="budget_min"
              label="Budget min (AED)"
              icon={Banknote}
              type="number"
              placeholder="500000"
              optional
            />
            <IconField
              control={control}
              name="budget_max"
              id="budget_max"
              label="Budget max (AED)"
              icon={Banknote}
              type="number"
              placeholder="2000000"
              optional
            />
          </div>
          <SelectField
            control={control}
            name="preferred_type"
            id="preferred_type"
            label="Property type"
            options={propertyTypes}
            placeholder="Any type"
            optional
          />
          <TagField
            control={control}
            name="preferred_locations"
            label="Areas"
            description="Areas the client is interested in"
            placeholder="Add an area and press Enter"
          />
        </section>
      </div>

      <FormFooter
        canSave={!isPending}
        isSubmitting={isPending}
        onCancel={onClose}
        submitLabel={isEdit ? "Save changes" : "Add client"}
        submittingLabel={isEdit ? "Saving..." : "Adding..."}
      />
    </form>
  )
}
