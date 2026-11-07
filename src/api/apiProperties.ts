import { uploadGalleryImagesApi } from "@/api/uploader"
import { ForbiddenError, toRequestError } from "@/lib/errors"
import action from "@/lib/handler/action"
import { cleanSearch } from "@/lib/helpers"
import { supabase } from "@/lib/supabase"
import { propertySchema, updatePropertyStatusSchema } from "@/lib/validation"
import type {
  PropertiesQueryParams,
  Property,
  PropertyStatus,
} from "@/types/database"
import type { PropertyFormValues } from "@/types/global"

const PROPERTY_WITH_AGENT =
  "*, agent:user_profiles!properties_agent_id_user_profiles_fkey(full_name, avatar, email)"

const BUCKET = "property-images"

// Validates and converts the form, uploads new photos, returns database values
async function toPropertyRow(values: PropertyFormValues) {
  const { params, user } = await action({
    params: values,
    schema: propertySchema,
    authorize: true,
  })
  const { gallery_images, ...fields } = params

  const urls = await uploadGalleryImagesApi({
    images: gallery_images,
    bucket: BUCKET,
  })

  return {
    row: { ...fields, gallery_images: urls, main_image: urls[0] ?? null },
    user,
  }
}

export async function createPropertyApi(values: PropertyFormValues) {
  const { row, user } = await toPropertyRow(values)

  const { error } = await supabase.from("properties").insert({
    ...row,
    // Every new listing waits for a manager or admin to approve it
    status: "pending-approval",
    agent_id: user!.id,
  })

  if (error) throw toRequestError(error, "Property")
}

export async function updatePropertyApi({
  id,
  values,
}: {
  id: number
  values: PropertyFormValues
}) {
  // No status in the row: it only changes through updatePropertyStatusApi
  const { row } = await toPropertyRow(values)

  const { data, error } = await supabase
    .from("properties")
    .update(row)
    .eq("id", id)
    .select("id")

  if (error) throw toRequestError(error, "Property")

  // RLS blocks updates silently: no error, zero rows changed
  if (data.length === 0) {
    throw new ForbiddenError("You can only edit your own listings")
  }
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

  // Cleaned so input cannot become filter syntax
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

  // One page of rows plus the total, for the pagination
  const from = (page - 1) * pageSize
  query = query.range(from, from + pageSize - 1)

  const { data, error, count } = await query
  if (error) throw toRequestError(error, "Properties")

  return { data: data ?? [], count: count ?? 0 }
}

// Null when the listing does not exist, so the page shows "not found"
export async function getPropertyApi(id: number): Promise<Property | null> {
  const { data, error } = await supabase
    .from("properties")
    .select(PROPERTY_WITH_AGENT)
    .eq("id", id)
    .maybeSingle()

  if (error) throw toRequestError(error, "Property")
  return data
}

export async function updatePropertyStatusApi(values: {
  id: number
  status: PropertyStatus
}) {
  const { params } = await action({
    params: values,
    schema: updatePropertyStatusSchema,
  })

  const { data, error } = await supabase
    .from("properties")
    .update({ status: params.status })
    .eq("id", params.id)
    .select("id")

  if (error) throw toRequestError(error, "Property")

  if (data.length === 0) {
    throw new ForbiddenError("You cannot change this listing's status")
  }
}

// Adds one view in a single database step (see increment_property_views),
// so two visits at the same moment cannot overwrite each other
export async function incrementPropertyViewsApi(id: number): Promise<number> {
  const { data, error } = await supabase.rpc("increment_property_views", {
    property_id: id,
  })

  if (error) throw toRequestError(error, "Property")
  return data as number
}

export async function deletePropertyApi(id: number) {
  // A listing with viewings fails here (23503): toRequestError turns that
  // into "This property is linked to other records"
  const { data, error } = await supabase
    .from("properties")
    .delete()
    .eq("id", id)
    .select("id")

  if (error) throw toRequestError(error, "Property")

  if (data.length === 0) {
    throw new ForbiddenError("Only admins can delete listings")
  }
}
