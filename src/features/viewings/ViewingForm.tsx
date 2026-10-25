import DatePickerField from "@/components/common/DatePickerField"
import { FormFooter } from "@/components/form-components/FormFooter"
import SelectField from "@/components/form-components/SelectField"
import { useClients } from "@/features/clients/useClients"
import { useAllProperties } from "@/features/properties/useAllProperties"
import { durationOptions } from "@/lib/constants"
import type { ViewingFormProps } from "@/types/database"
import { useViewingForm } from "./useViewingForm"

export default function ViewingForm({ onClose }: ViewingFormProps) {
  const { form, isPending, onSubmit } = useViewingForm({ onClose })
  const { control } = form

  const { properties, isLoading: loadingProperties } = useAllProperties()
  const { clients, isLoading: loadingClients } = useClients()

  const propertyOptions = (properties ?? []).map((p) => ({
    value: String(p.id),
    label: p.title,
  }))

  const clientOptions = (clients ?? []).map((c) => ({
    value: String(c.id),
    label: c.full_name || c.email,
  }))

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex flex-1 flex-col overflow-hidden"
    >
      <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
        <section className="space-y-5">
          <h3 className="text-sm font-medium">Who and where</h3>
          <SelectField
            control={control}
            name="property_id"
            id="property_id"
            label="Property"
            placeholder={loadingProperties ? "Loading..." : "Select a property"}
            options={propertyOptions}
            required
          />
          <SelectField
            control={control}
            name="client_id"
            id="client_id"
            label="Client"
            placeholder={loadingClients ? "Loading..." : "Select a client"}
            options={clientOptions}
            required
          />
        </section>

        <section className="space-y-5 border-t pt-6">
          <h3 className="text-sm font-medium">When</h3>
          {/* Date gets the flexible column, duration a fixed one */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-[minmax(0,1fr)_10rem]">
            <DatePickerField
              control={control}
              name="scheduled_at"
              id="scheduled_at"
              label="Date and time"
              withTime
              disablePast
              required
            />
            <SelectField
              control={control}
              name="duration_minutes"
              id="duration_minutes"
              label="Duration"
              placeholder="Select duration"
              options={durationOptions}
              required
            />
          </div>
        </section>
      </div>

      <FormFooter
        canSave={!isPending}
        isSubmitting={isPending}
        onCancel={onClose}
        submitLabel="Schedule viewing"
        submittingLabel="Scheduling..."
      />
    </form>
  )
}
