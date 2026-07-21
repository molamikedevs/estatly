import { clientSchema } from "@/lib/validation"
import type { Client } from "@/types/database"
import type { ClientFormValues } from "@/types/global"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useCreateClient } from "./useCreateClient"
import { useUpdateClient } from "./useUpdateClient"

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

// Existing client (numbers) -> form values (strings) for editing
function clientToFormValues(c: Client): ClientFormValues {
  return {
    full_name: c.full_name,
    email: c.email,
    phone: c.phone ?? "",
    nationality: c.nationality ?? "",
    budget_min: c.budget_min != null ? String(c.budget_min) : "",
    budget_max: c.budget_max != null ? String(c.budget_max) : "",
    preferred_type: c.preferred_type ?? "",
    preferred_locations: c.preferred_locations ?? [],
    notes: c.notes ?? "",
    status: c.status,
  }
}

interface UseClientFormParams {
  client?: Client
  onClose: () => void
}

export function useClientForm({ client, onClose }: UseClientFormParams) {
  const isEdit = Boolean(client)

  const { updateClient, isPending: isUpdating } = useUpdateClient()
  const { createClient, isPending: isCreating } = useCreateClient()
  const isPending = isEdit ? isUpdating : isCreating

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    mode: "onBlur",
    defaultValues: client ? clientToFormValues(client) : EMPTY_VALUES,
  })

  const onSubmit = form.handleSubmit((values) => {
    if (isEdit && client) {
      updateClient(
        { newClient: values, id: String(client.id) },
        { onSuccess: onClose }
      )
    } else {
      createClient(values, { onSuccess: onClose })
    }
  })

  return { form, isEdit, isPending, onSubmit }
}
