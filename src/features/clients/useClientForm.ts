import { clientSchema } from "@/lib/validation"
import type { ClientFormValues } from "@/types/global"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useCreateClient } from "./useCreateClient"

const EMPTY_VALUES: ClientFormValues = {
  full_name: "",
  email: "",
  phone: "",
  nationality: "",
  budget_min: "",
  budget_max: "",
  preferred_type: "",
  preferred_locations: [],
  notes: "",
  status: "active",
}

export function useClientForm({ onClose }: { onClose: () => void }) {
  const { createClient, isPending } = useCreateClient()

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    mode: "onBlur",
    defaultValues: EMPTY_VALUES,
  })

  const onSubmit = form.handleSubmit((values) => {
    createClient(values, { onSuccess: onClose })
  })

  return { form, isPending, onSubmit }
}
