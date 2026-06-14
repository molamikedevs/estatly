import { PAGE_SIZE } from "@/lib/constants"
import { buildPropertyPayload } from "@/lib/helpers"
import { supabase } from "@/lib/supabase"
import type {
  PropertiesQueryParams,
  Property,
  PropertyStatus,
} from "@/types/database"
import type { PropertyFormValues } from "@/types/global"

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

export async function getPropertiesApi({
  filter,
  search,
  page,
  sortBy,
}: PropertiesQueryParams): Promise<{ data: Property[]; count: number }> {
  let query = supabase
    .from("properties")
    .select(
      `*, agent:user_profiles!properties_agent_id_user_profiles_fkey(full_name, avatar, email)`,
      { count: "exact" }
    )

  //Filter
  if (filter !== "all") query = query.eq("listing_type", filter)

  // search
  if (search) query = query.or(`title.ilike.%${search}%,city.ilike.%${search}%`)

  // Sort
  switch (sortBy) {
    case "newest":
      query = query.order("created_at", { ascending: false })
      break
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

  // paginate
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1
  query = query.range(from, to)

  const { data, error, count } = await query
  if (error) {
    throw new Error("Properties could not be loaded")
  }

  return { data: data ?? [], count: count ?? 0 }
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
