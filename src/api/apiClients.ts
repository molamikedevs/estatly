import { ForbiddenError, toRequestError } from "@/lib/errors"
import action from "@/lib/handler/action"
import { supabase } from "@/lib/supabase"
import {
  clientSchema,
  updateClientStatusSchema,
  type ClientFormValues,
} from "@/lib/validation"
import type { Client, ClientStatus } from "@/types/database"

export async function getClientsApi(): Promise<Client[]> {
  const { data, error } = await supabase
    .from("clients")
    .select(
      "*, agent:user_profiles!clients_assigned_agent_id_user_profiles_fkey(full_name, avatar, email), viewings(count)"
    )
    .order("created_at", { ascending: false })

  if (error) throw toRequestError(error, "Clients")

  // Without database types, Supabase guesses joins are arrays.
  // agent is many-to-one (one object); viewings(count) comes back as [{ count }].
  const rows = (data ?? []) as unknown as (Omit<Client, "viewing_count"> & {
    viewings: { count: number }[]
  })[]

  return rows.map(({ viewings, ...client }) => ({
    ...client,
    viewing_count: viewings[0]?.count ?? 0,
  }))
}

export async function createClientApi(values: ClientFormValues) {
  // The creator owns the lead; new clients always start as active
  const { params, user } = await action({
    params: values,
    schema: clientSchema,
    authorize: true,
  })

  const { error } = await supabase
    .from("clients")
    .insert({ ...params, status: "active", assigned_agent_id: user!.id })

  if (error) throw toRequestError(error, "Client")
}

export async function updateClientApi({
  id,
  values,
}: {
  id: number
  values: ClientFormValues
}) {
  const { params } = await action({ params: values, schema: clientSchema })

  const { data, error } = await supabase
    .from("clients")
    .update(params)
    .eq("id", id)
    .select("id")

  if (error) throw toRequestError(error, "Client")

  // RLS blocks updates silently: no error, zero rows changed
  if (data.length === 0) {
    throw new ForbiddenError("You can only edit your own clients")
  }
}

export async function updateClientStatusApi(values: {
  id: number
  status: ClientStatus
}) {
  const { params } = await action({
    params: values,
    schema: updateClientStatusSchema,
  })

  const { data, error } = await supabase
    .from("clients")
    .update({ status: params.status })
    .eq("id", params.id)
    .select("id")

  if (error) throw toRequestError(error, "Client")

  if (data.length === 0) {
    throw new ForbiddenError("You can only move your own clients")
  }
}

export async function deleteClientApi(id: number) {
  // With ON DELETE RESTRICT, a client with viewings fails here (23503),
  // and toRequestError turns that into "This client is linked to other records"
  const { data, error } = await supabase
    .from("clients")
    .delete()
    .eq("id", id)
    .select("id")

  if (error) throw toRequestError(error, "Client")

  if (data.length === 0) {
    throw new ForbiddenError("You can only delete your own clients")
  }
}
