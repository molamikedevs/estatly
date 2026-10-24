import { clientFormSchema, type ClientFormValues } from "@/lib/validation"
import type { Client } from "@/types/database"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useCreateClient } from "./useCreateClient"
import { useEditClient } from "./useEditClient"

const EMPTY_VALUES: ClientFormValues = {
  full_name: "",
  email: "",
  phone: "",
  nationality: "",
  budget_min: "",
  budget_max: "",
  preferred_type: "",
  preferred_locations: [],
}

// Database values (numbers, nulls) → form values (strings)
function toFormValues(client: Client): ClientFormValues {
  return {
    full_name: client.full_name,
    email: client.email,
    phone: client.phone ?? "",
    nationality: client.nationality ?? "",
    budget_min: client.budget_min?.toString() ?? "",
    budget_max: client.budget_max?.toString() ?? "",
    preferred_type: client.preferred_type ?? "",
    preferred_locations: client.preferred_locations ?? [],
  }
}

interface UseClientFormParams {
  client?: Client
  onClose: () => void
}

export function useClientForm({ client, onClose }: UseClientFormParams) {
  const { createClient, isPending: isCreating } = useCreateClient()
  const { editClient, isPending: isEditing } = useEditClient()

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    mode: "onTouched",
    defaultValues: client ? toFormValues(client) : EMPTY_VALUES,
  })

  const onSubmit = form.handleSubmit((values) => {
    if (client) {
      editClient({ id: client.id, values }, { onSuccess: onClose })
    } else {
      createClient(values, { onSuccess: onClose })
    }
  })

  return {
    form,
    isEdit: Boolean(client),
    isPending: isCreating || isEditing,
    onSubmit,
  }
}
