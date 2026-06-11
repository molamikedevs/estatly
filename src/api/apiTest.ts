import { PAGE_SIZE } from "@/lib/constants"
import { supabase } from "@/lib/supabase"
import type {
  PropertiesQueryParams,
  Property,
  Viewing,
  ViewingsQueryParams,
} from "@/types/database"

export async function getViewings({
  filter,
  sortBy,
  page,
  search,
}: ViewingsQueryParams): Promise<{ data: Viewing[]; count: number }> {
  const embed = search ? "properties!inner" : "properties"
  let query = supabase
    .from("viewings")
    .select(
      `*, property:${embed}(title, city, neighborhood, main_image), client:clients(full_name, email, phone), agent:user_profiles!viewings_agent_id_user_profiles_fkey(full_name, avatar, email)`,
      { count: "exact" }
    )

  // 1 Filter (skip all completely)
  if (filter !== "all") query = query.eq("status", filter)

  // 2 Sort
  query = query.order("scheduled_at", { ascending: sortBy === "soonest" })

  if (search) query = query.ilike("property.title", `%{search}%`)

  // 3. Paginate
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1
  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    throw new Error("Viewings could not be loaded")
  }

  return { data: data ?? [], count: count ?? 0 }
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
  if (search)
    query = query.or(
      `title.ilike.%${search}%,city.ilike.%${search}%,neighborhood.ilike.%${search}%`
    )

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
