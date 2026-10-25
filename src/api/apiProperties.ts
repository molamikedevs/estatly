import { buildPropertyPayload } from "@/lib/helpers"
import { supabase } from "@/lib/supabase"
import type {
  PropertiesQueryParams,
  Property,
  PropertyStatus,
} from "@/types/database"
import type { PropertyFormValues } from "@/types/global"

const PROPERTY_WITH_AGENT =
  "*, agent:user_profiles!properties_agent_id_user_profiles_fkey(full_name, avatar, email)"

/** Remove characters that break PostgREST's or() filter or act as wildcards. */
function cleanSearch(term: string) {
  return term
    .replace(/[,()%_*\\]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

export async function createPropertyApi(
  newProperty: PropertyFormValues
): Promise<Property> {
  const dbReady = await buildPropertyPayload(newProperty)

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("You need to be signed in to add a property")

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

export async function getPropertiesApi({
  filter,
  search,
  page,
  sortBy,
  pageSize,
}: PropertiesQueryParams): Promise<{ data: Property[]; count: number }> {
  let query = supabase
    .from("properties")
    .select(PROPERTY_WITH_AGENT, { count: "exact" })

  if (filter !== "all") query = query.eq("listing_type", filter)

  const term = cleanSearch(search)
  if (term) query = query.or(`title.ilike.%${term}%,city.ilike.%${term}%`)

  switch (sortBy) {
    case "oldest":
      query = query.order("created_at", { ascending: true })
      break
    case "price-asc":
      query = query.order("price", { ascending: true })
      break
    case "price-desc":
      query = query.order("price", { ascending: false })
      break
    case "views-desc":
      query = query.order("views_count", { ascending: false })
      break
    default:
      query = query.order("created_at", { ascending: false })
  }

  const from = (page - 1) * pageSize
  query = query.range(from, from + pageSize - 1)

  const { data, error, count } = await query
  if (error) {
    console.error("getPropertiesApi error:", error)
    throw new Error("Properties could not be loaded")
  }

  return { data: data ?? [], count: count ?? 0 }
}

export async function getAllPropertiesApi(): Promise<
  Pick<Property, "id" | "title">[]
> {
  const { data, error } = await supabase
    .from("properties")
    .select("id, title")
    .order("title")

  if (error) {
    console.error("getAllPropertiesApi error:", error)
    throw new Error("Properties could not be loaded")
  }
  return data ?? []
}

/** Returns null when the listing doesn't exist, so the page shows "not found". */
export async function getPropertyApi(id: number): Promise<Property | null> {
  const { data, error } = await supabase
    .from("properties")
    .select(PROPERTY_WITH_AGENT)
    .eq("id", id)
    .maybeSingle()

  if (error) {
    console.error("getPropertyApi error:", error)
    throw new Error("Property could not be loaded")
  }

  return data
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

/** Adds one view in a single database step (see increment_property_views). */
export async function incrementPropertyViewsApi(id: number): Promise<number> {
  const { data, error } = await supabase.rpc("increment_property_views", {
    property_id: id,
  })

  if (error) {
    console.error("incrementPropertyViewsApi error:", error)
    throw new Error("View could not be counted")
  }

  return data as number
}

export async function deletePropertyApi(id: number) {
  const { error } = await supabase.from("properties").delete().eq("id", id)

  if (error) {
    console.error("deletePropertyApi error:", error)
    throw new Error("Property could not be deleted")
  }
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
