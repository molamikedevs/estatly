import { supabase } from "@/lib/supabase"
import type { GalleryImage, Property } from "@/types/database"
import type { PropertyFormValues } from "@/types/global"

export async function createUpdatePropertyApi(
  newProperty: PropertyFormValues,
  id?: string
): Promise<Property> {
  const galleryImages = newProperty.gallery_images as GalleryImage[]

  // --- 1. Upload any NEW images first ---
  // If an upload fails we throw before touching the DB, so there's
  // nothing to roll back.
  const resolvedUrls: string[] = []

  for (const image of galleryImages) {
    // Existing image — already hosted, keep its URL
    if (!image.file) {
      resolvedUrls.push(image.url)
      continue
    }

    // New image — upload it to storage
    const fileName = `${crypto.randomUUID()}-${image.file.name.replaceAll("/", "")}`

    const { error: uploadError } = await supabase.storage
      .from("property-images")
      .upload(fileName, image.file)

    if (uploadError) {
      throw new Error(`Image upload failed: ${uploadError.message}`)
    }

    const { data: urlData } = supabase.storage
      .from("property-images")
      .getPublicUrl(fileName)

    resolvedUrls.push(urlData.publicUrl)
  }

  // --- 2. Build the DB-ready payload ---
  // The form gives us number fields as strings; convert them here.
  const dbReady = {
    ...newProperty,
    price: Number(newProperty.price),
    bedrooms: Number(newProperty.bedrooms),
    bathrooms: Number(newProperty.bathrooms),
    size_sqm: Number(newProperty.size_sqm),
    year_built: newProperty.year_built ? Number(newProperty.year_built) : null,
    gallery_images: resolvedUrls,
    main_image: resolvedUrls[0] ?? null,
  }

  // --- 3. Insert or update ---
  let query

  if (id) {
    // EDIT — ownership (agent_id) stays as-is, so don't include it
    query = supabase.from("properties").update(dbReady).eq("id", id)
  } else {
    // CREATE — assign the current user as the owning agent
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Not authenticated")

    query = supabase
      .from("properties")
      .insert([{ ...dbReady, agent_id: user.id }])
  }

  const { data, error } = await query.select().single()

  if (error) {
    console.error(error)
    throw new Error(
      id ? "Property could not be updated" : "Property could not be created"
    )
  }

  return data
}

export async function getPropertiesApi(): Promise<Property[]> {
  const { data, error } = await supabase
    .from("properties")
    .select(
      "*, agent:user_profiles!properties_agent_id_user_profiles_fkey(full_name, avatar, email)"
    )
    .order("created_at", { ascending: false })

  if (error) {
    console.error("getPropertiesApi error:", error)
    throw new Error(error.message)
  }

  return data ?? []
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
    throw new Error(error.message)
  }

  return data
}

export async function deletePropertyApi(id: string | number) {
  const { data, error } = await supabase
    .from("properties")
    .delete()
    .eq("id", id)

  if (error) throw new Error("Property could not be deleted")

  return data
}
