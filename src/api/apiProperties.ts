import action from "@/lib/handlers/action"
import handleError from "@/lib/handlers/error"
import {
  NotFoundError,
  RequestError,
  UnauthorizedError,
} from "@/lib/http-errors"
import { supabase } from "@/lib/supabase"
import {
  CreatePropertySchema,
  EditPropertySchema,
  PropertyQuerySchema,
} from "@/lib/validation"
import type {
  PropertiesQueryParams,
  PropertyParams,
  PropertyStatus,
} from "@/types/database"
import type {
  ActionResponse,
  EditPropertyFormValues,
  PropertyFormValues,
} from "@/types/global"
import { uploadGalleryImagesApi } from "./uploader"

export async function createPropertyApi(
  params: PropertyFormValues
): Promise<ActionResponse<{ property: PropertyParams }>> {
  const validationResult = await action({
    params,
    schema: CreatePropertySchema,
    authorize: true,
  })

  if (validationResult instanceof Error) {
    return handleError(validationResult)
  }

  const validated = validationResult.params!

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new UnauthorizedError("Not authenticated user")

    // upload images first → get URLs
    const resolvedUrls = await uploadGalleryImagesApi({
      images: validated.gallery_images,
      bucket: "property-images",
    })

    const { data, error } = await supabase
      .from("properties")
      .insert([
        {
          ...validated,
          // convert string inputs to numbers
          price: Number(validated.price),
          bedrooms: Number(validated.bedrooms),
          bathrooms: Number(validated.bathrooms),
          size_sqm: Number(validated.size_sqm),
          year_built: validated.year_built
            ? Number(validated.year_built)
            : null,
          latitude: validated.latitude ? Number(validated.latitude) : null,
          longitude: validated.longitude ? Number(validated.longitude) : null,
          gallery_images: resolvedUrls,
          main_image: resolvedUrls[0] ?? null,
          // server-set fields
          agent_id: user.id,
        },
      ])
      .select()
      .single()

    if (error) {
      throw new RequestError(500, "Property could not be created")
    }

    return { success: true, data: { property: data } }
  } catch (error) {
    return handleError(error)
  }
}

export async function updatePropertyApi(
  params: EditPropertyFormValues
): Promise<ActionResponse<{ property: PropertyParams }>> {
  const validationResult = await action({
    params,
    schema: EditPropertySchema,
    authorize: true,
  })
  if (validationResult instanceof Error) {
    return handleError(validationResult)
  }

  const { id, ...updates } = validationResult.params!

  const resolvedUrls = await uploadGalleryImagesApi({
    images: updates.gallery_images,
    bucket: "property-images",
  })

  try {
    const { data, error } = await supabase
      .from("properties")
      .update({
        ...updates,
        price: Number(updates.price),
        bedrooms: Number(updates.bedrooms),
        bathrooms: Number(updates.bathrooms),
        size_sqm: Number(updates.size_sqm),
        year_built: updates.year_built ? Number(updates.year_built) : null,
        latitude: updates.latitude ? Number(updates.latitude) : null,
        longitude: updates.longitude ? Number(updates.longitude) : null,
        gallery_images: resolvedUrls,
        main_image: resolvedUrls[0] ?? null,
      })
      .eq("id", Number(id))
      .select()
      .single()

    if (error) {
      console.error("updatePropertyApi error:", error)
      throw new RequestError(500, "Property could not be updated")
    }

    return { success: true, data: { property: data } }
  } catch (error) {
    return handleError(error)
  }
}

export async function getPropertiesApi(
  params: PropertiesQueryParams
): Promise<ActionResponse<{ properties: PropertyParams[]; count: number }>> {
  const validationResult = await action({ params, schema: PropertyQuerySchema })
  if (validationResult instanceof Error) {
    return handleError(validationResult)
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
      data: { properties: properties as PropertyParams[], count: total },
    }
  } catch (error) {
    return handleError(error)
  }
}

// in apiProperties
export async function getAllPropertiesApi(): Promise<
  Pick<PropertyParams, "id" | "title">[]
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

export async function getPropertyApi(id: number): Promise<PropertyParams> {
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
