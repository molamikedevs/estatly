import { RequestError } from "@/lib/errors"
import { supabase } from "@/lib/supabase"
import type { GalleryImage } from "@/types/database"

interface UploadImagesParams {
  images: GalleryImage[]
  bucket: string
}

// Uploads new photos and keeps existing URLs. All uploads run at once;
// Promise.all keeps the input order, so the first photo stays the main one
export async function uploadGalleryImagesApi({
  images,
  bucket,
}: UploadImagesParams): Promise<string[]> {
  return Promise.all(
    images.map(async (image) => {
      if (!image.file) return image.url

      // Random prefix: two photos named "living-room.jpg" never collide
      const fileName = `${crypto.randomUUID()}-${image.file.name.replaceAll("/", "")}`

      const { error } = await supabase.storage
        .from(bucket)
        .upload(fileName, image.file)

      if (error) throw new RequestError(400, "A photo could not be uploaded")

      return supabase.storage.from(bucket).getPublicUrl(fileName).data.publicUrl
    })
  )
}
