import { supabase } from "@/lib/supabase"
import type { GalleryImage } from "@/types/database"

interface UploaderAvatarParams {
  file: File
  userId: string
  bucket: string
}

interface PropertyImagesParams {
  images: GalleryImage[]
  bucket: string
}

export async function avatarUploaderApi({
  file,
  userId,
  bucket,
}: UploaderAvatarParams) {
  const fileExt = file.name.split(".").pop()
  const fileName = `avatar-${userId}-${Date.now()}.${fileExt}`

  const { error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, { upsert: true })

  if (error) {
    console.error("avatarUploaderApi error:", error)
    throw new Error("Avatar upload failed")
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName)

  return data.publicUrl
}

export async function uploadGalleryImagesApi({
  images,
  bucket,
}: PropertyImagesParams): Promise<string[]> {
  const resolvedUrls: string[] = []

  for (const image of images) {
    if (!image.file) {
      resolvedUrls.push(image.url)
      continue
    }

    const fileName = `${crypto.randomUUID()}-${image.file.name.replaceAll("/", "")}`

    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, image.file)

    if (error) {
      console.error("uploadGalleryImagesApi", error)
      throw new Error("Image upload failed")
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName)
    resolvedUrls.push(data.publicUrl)
  }

  return resolvedUrls
}
