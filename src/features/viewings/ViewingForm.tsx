import DatePickerField from "@/components/DatePickerField"
import SelectField from "@/components/form-components/SelectField"
import { useClients } from "@/features/clients/useClients"
import { useProperties } from "@/features/properties/useProperties"
import { durationOptions } from "@/lib/constants"
import type { ViewingFormProps } from "@/types/database"
import { FormFooter } from "../../components/form-components/FormFooter"
import { useViewingForm } from "./useViewingForm"

export default function ViewingForm({ onClose }: ViewingFormProps) {
  const { form, isPending, onSubmit } = useViewingForm({ onClose })
  const { control } = form

  const { properties, isLoading: loadingProperties } = useProperties()
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
    <form onSubmit={onSubmit} className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 scrollbar-thin space-y-6 overflow-y-auto px-6 py-6">
        {/* Participants */}
        <div className="space-y-5">
          <p className="text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
            Participants
          </p>
          <SelectField
            control={control}
            name="property_id"
            id="property_id"
            label="Property"
            placeholder={loadingProperties ? "Loading…" : "Select a property"}
            options={propertyOptions}
            required
          />
          <SelectField
            control={control}
            name="client_id"
            id="client_id"
            label="Client"
            placeholder={loadingClients ? "Loading…" : "Select a client"}
            options={clientOptions}
            required
          />
        </div>

        {/* Schedule */}
        <div className="space-y-5 border-t border-border/60 pt-6">
          <p className="text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
            Schedule
          </p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <DatePickerField
              control={control}
              name="scheduled_at"
              id="scheduled_at"
              label="Date & time"
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
        </div>
      </div>

      <FormFooter
        canSave={!isPending}
        isSubmitting={isPending}
        onCancel={onClose}
        submitLabel="Schedule viewing"
        submittingLabel="Scheduling…"
      />
    </form>
  )
}
