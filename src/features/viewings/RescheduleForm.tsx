import DatePickerField from "@/components/common/DatePickerField"
import { FormFooter } from "@/components/form-components/FormFooter"
import SelectField from "@/components/form-components/SelectField"
import { durationOptions } from "@/lib/constants"
import { formatDateTime, getClientLabel } from "@/lib/helpers"
import {
  rescheduleFormSchema,
  type RescheduleFormValues,
} from "@/lib/validation"
import type { Viewing } from "@/types/database"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRescheduleViewing } from "./useRescheduleViewing"

interface RescheduleFormProps {
  viewing: Viewing
  onClose: () => void
}

export default function RescheduleForm({
  viewing,
  onClose,
}: RescheduleFormProps) {
  const { rescheduleViewing, isPending } = useRescheduleViewing()

  const { control, handleSubmit } = useForm<RescheduleFormValues>({
    resolver: zodResolver(rescheduleFormSchema),
    mode: "onTouched",
    defaultValues: {
      scheduled_at: viewing.scheduled_at,
      // Stored as a number; the select works with strings
      duration_minutes: String(
        viewing.duration_minutes
      ) as RescheduleFormValues["duration_minutes"],
    },
  })

  const onSubmit = handleSubmit((values) => {
    rescheduleViewing({ ...values, id: viewing.id }, { onSuccess: onClose })
  })

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex flex-1 flex-col overflow-hidden"
    >
      <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
        {/* What is being moved, so the user does not lose context */}
        <div className="rounded-lg bg-muted p-3 text-sm">
          <p className="truncate font-medium">
            {viewing.property?.title ?? "Property removed"}
          </p>
          <p className="truncate text-muted-foreground">
            {getClientLabel(viewing)} · now{" "}
            {formatDateTime(viewing.scheduled_at)}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-[minmax(0,1fr)_10rem]">
          <DatePickerField
            control={control}
            name="scheduled_at"
            id="reschedule_at"
            label="New date and time"
            withTime
            disablePast
            required
          />
          <SelectField
            control={control}
            name="duration_minutes"
            id="reschedule_duration"
            label="Duration"
            placeholder="Select duration"
            options={durationOptions}
            required
          />
        </div>
      </div>

      <FormFooter
        canSave={!isPending}
        isSubmitting={isPending}
        onCancel={onClose}
        submitLabel="Reschedule"
        submittingLabel="Rescheduling..."
      />
    </form>
  )
}
