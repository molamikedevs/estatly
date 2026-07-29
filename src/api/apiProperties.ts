import action from "@/lib/handlers/action"
import handleError from "@/lib/handlers/error"
import { buildPropertyPayload } from "@/lib/helpers"
import { NotFoundError } from "@/lib/http-errors"
import { supabase } from "@/lib/supabase"
import { PropertyQuerySchema } from "@/lib/validation"
import type {
  PropertiesQueryParams,
  Property,
  PropertyStatus,
} from "@/types/database"
import type {
  ActionResponse,
  ErrorResponse,
  PropertyFormValues,
} from "@/types/global"

export async function createPropertyApi(
  newProperty: PropertyFormValues
): Promise<Property> {
  const dbReady = await buildPropertyPayload(newProperty)

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated user")

  const { data, error } = await supabase
    .from("properties")
    .insert([{ ...dbReady, agent_id: user.id }])
    .select()
    .single()

  if (error) {
    console.error("createPropertyApi error:", error)
    throw new Error("Property could not be created")
  }

  return data
}
export async function updatePropertyApi(
  newProperty: PropertyFormValues,
  id: string
) {
  const dbReady = await buildPropertyPayload(newProperty)

  const { data, error } = await supabase
    .from("properties")
    .update(dbReady)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("updatePropertyApi error:", error)
    throw new Error("Property could not be updated")
  }

  return data
}

export async function getPropertiesApi(
  params: PropertiesQueryParams
): Promise<ActionResponse<{ properties: Property[]; count: number }>> {
  const validationResult = await action({ params, schema: PropertyQuerySchema })
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse
  }

  const {
    page = 1,
    page_size = 10,
    filter,
    sort_by,
    query,
  } = validationResult.params!

  const from = (page - 1) * page_size
  const to = from + page_size - 1

  try {
    let supabaseQuery = supabase
      .from("properties")
      .select(
        `*, agent:user_profiles!properties_agent_id_user_profiles_fkey(full_name, avatar, email)`,
        { count: "exact" }
      )
    // filter
    if (filter !== "all")
      supabaseQuery = supabaseQuery.eq("listing_type", filter)

    // search
    if (query)
      supabaseQuery = supabaseQuery.or(
        `title.ilike.%${query}%,city.ilike.%${query}%`
      )

    // Sort
    switch (sort_by) {
      case "oldest":
        supabaseQuery = supabaseQuery.order("created_at", { ascending: true })
        break
      case "price-asc":
        supabaseQuery = supabaseQuery.order("price", { ascending: true })
        break
      case "price-desc":
        supabaseQuery = supabaseQuery.order("price", { ascending: false })
        break
      case "views-desc":
        supabaseQuery = supabaseQuery.order("views_count", { ascending: false })
        break
      default: // "recent" / newest
        supabaseQuery = supabaseQuery.order("created_at", { ascending: false })
    }

    // paginate
    supabaseQuery = supabaseQuery.range(from, to)

    const { data, error, count } = await supabaseQuery
    if (error) throw new NotFoundError("Properties could not be loaded")

    const properties = data ?? []
    const total = count ?? 0

    return {
      success: true,
      data: { properties: properties as Property[], count: total },
    }
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}

// in apiProperties
export async function getAllPropertiesApi(): Promise<
  Pick<Property, "id" | "title">[]
> {
  const { data, error } = await supabase
    .from("properties")
    .select("id, title")
    .order("title")

  if (error) {
    throw new Error("Properties could not be loaded")
  }
  return data ?? []
}

export async function updatePropertyStatusApi(
  id: number,
  status: PropertyStatus
) {
  const { data, error } = await supabase
    .from("properties")
    .update({ status })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("updatePropertyStatusApi error:", error)
    throw new Error("Property status could not be updated")
  }
  return data
}

export async function incrementPropertyViewsApi(id: number): Promise<number> {
  const { data, error: readError } = await supabase
    .from("properties")
    .select("views_count")
    .eq("id", id)
    .single()

  if (readError) {
    console.error("incrementPropertyViewsApi read error:", readError)
    throw new Error(readError.message)
  }

  const nextCount = (data.views_count ?? 0) + 1

  const { error: writeError } = await supabase
    .from("properties")
    .update({ views_count: nextCount })
    .eq("id", id)

  if (writeError) {
    console.error("incrementPropertyViewsApi write error:", writeError)
    throw new Error(writeError.message)
  }

  return nextCount
}

export async function getPropertyApi(id: number): Promise<Property> {
  const { data, error } = await supabase
    .from("properties")
    .select(
      "*, agent:user_profiles!properties_agent_id_user_profiles_fkey(full_name, avatar, email)"
    )
    .eq("id", id)
    .single()

  if (error) {
    console.error("getPropertyApi error:", error)
    throw new Error("Property id details could not be loaded")
  }

  return data
}

export async function deletePropertyApi(id: string | number) {
  const { error } = await supabase.from("properties").delete().eq("id", id)

  if (error) throw new Error("Property could not be deleted")
}

export async function getPropertiesByStatusApi(): Promise<
  { status: PropertyStatus; count: number }[]
> {
  const { data, error } = await supabase.rpc("properties_by_status")
  if (error) {
    console.error("getPropertiesByStatusApi error:", error)
    throw new Error("Property status breakdown could not be loaded")
  }
  return data ?? []
}
