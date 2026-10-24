import { Field, FieldError, FieldLabel } from "@/components/ui/field"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarDays } from "lucide-react"
import { useState } from "react"
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"
import FieldLabelText from "./form-components/FieldLabelText"

interface DatePickerFieldProps<T extends FieldValues> {
  control: Control<T>
  name: FieldPath<T>
  id: string
  label: string
  required?: boolean
  optional?: boolean
  /** Show a time input alongside the date. Default false. */
  withTime?: boolean
  /** Restrict selectable dates. */
  fromYear?: number
  toYear?: number
  disableFuture?: boolean
  disablePast?: boolean
}

/* ── value <-> Date helpers ───────────────────────────── */

function parseValue(value: string): Date | undefined {
  if (!value) return undefined
  const d = new Date(value)
  return isNaN(d.getTime()) ? undefined : d
}

// "Sat, Oct 31 · 12:00", with the year only when it is not this year
function formatDisplay(date: Date, withTime: boolean) {
  const sameYear = date.getFullYear() === new Date().getFullYear()

  const datePart = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: sameYear ? undefined : "numeric",
  })
  if (!withTime) return datePart

  const timePart = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
  return `${datePart} · ${timePart}`
}

function toTimeInput(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export default function DatePickerField<T extends FieldValues>({
  control,
  name,
  id,
  label,
  required,
  optional,
  withTime = false,
  fromYear,
  toYear,
  disableFuture,
  disablePast,
}: DatePickerFieldProps<T>) {
  const [open, setOpen] = useState(false)

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const selected = parseValue(field.value)

        // Apply a time string to the selected date (or today)
        function applyTime(time: string) {
          const base = selected ? new Date(selected) : new Date()
          const [h, m] = time.split(":").map(Number)
          base.setHours(h || 0, m || 0, 0, 0)
          field.onChange(base.toISOString())
        }

        function handleSelectDate(date: Date | undefined) {
          if (!date) {
            field.onChange("")
            return
          }
          // Keep the chosen time when only the date changes
          if (withTime && selected) {
            date.setHours(selected.getHours(), selected.getMinutes(), 0, 0)
          }
          field.onChange(date.toISOString())
          if (!withTime) setOpen(false)
        }

        // Closing the picker counts as leaving the field, so errors can show
        function handleOpenChange(next: boolean) {
          setOpen(next)
          if (!next) field.onBlur()
        }

        return (
          <Field data-invalid={fieldState.invalid} className="min-w-0">
            <FieldLabel htmlFor={id}>
              <FieldLabelText required={required} optional={optional}>
                {label}
              </FieldLabelText>
            </FieldLabel>

            <Popover open={open} onOpenChange={handleOpenChange}>
              <PopoverTrigger asChild>
                <Button
                  id={id}
                  type="button"
                  variant="outline"
                  aria-invalid={fieldState.invalid}
                  className={cn(
                    "h-10 w-full min-w-0 justify-start gap-2 font-normal",
                    !selected && "text-muted-foreground"
                  )}
                >
                  <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
                  <span className="truncate">
                    {selected
                      ? formatDisplay(selected, withTime)
                      : withTime
                        ? "Pick date and time"
                        : "Pick a date"}
                  </span>
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selected}
                  onSelect={handleSelectDate}
                  captionLayout={fromYear || toYear ? "dropdown" : "label"}
                  startMonth={fromYear ? new Date(fromYear, 0) : undefined}
                  endMonth={toYear ? new Date(toYear, 11) : undefined}
                  disabled={(date) => {
                    if (disableFuture && date > new Date()) return true
                    if (disablePast) {
                      const today = new Date()
                      today.setHours(0, 0, 0, 0)
                      if (date < today) return true
                    }
                    return false
                  }}
                  autoFocus
                />

                {withTime && (
                  <div className="border-t p-3">
                    <label
                      htmlFor={`${id}-time`}
                      className="mb-1.5 block text-xs font-medium text-muted-foreground"
                    >
                      Time
                    </label>
                    <Input
                      id={`${id}-time`}
                      type="time"
                      value={selected ? toTimeInput(selected) : ""}
                      onChange={(e) => applyTime(e.target.value)}
                      className="h-10 text-base"
                    />
                  </div>
                )}
              </PopoverContent>
            </Popover>

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )
      }}
    />
  )
}
