import {
  ForbiddenError,
  RequestError,
  UnauthorizedError,
  toRequestError,
} from "@/lib/errors"
import action from "@/lib/handler/action"
import { supabase } from "@/lib/supabase"
import { profileSchema, type ProfileFormValues } from "@/lib/validation"

export async function updateProfileApi(values: ProfileFormValues) {
  const { params, user } = await action({
    params: values,
    schema: profileSchema,
    authorize: true,
  })

  const { data, error } = await supabase
    .from("user_profiles")
    .update(params)
    .eq("user_id", user!.id)
    .select("id")

  if (error) throw toRequestError(error, "Profile")
  if (data.length === 0)
    throw new ForbiddenError("Your profile could not be saved")
}

// The file is already resized in the browser (see useUploadAvatar)
export async function uploadAvatarApi(file: File) {
  const { data: sessionData } = await supabase.auth.getSession()
  const userId = sessionData.session?.user.id
  if (!userId) throw new UnauthorizedError()

  const ext = file.name.split(".").pop() ?? "webp"
  const fileName = `avatar-${userId}-${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(fileName, file, { upsert: true })

  if (uploadError) throw new RequestError(400, "Photo could not be uploaded")

  const { data } = supabase.storage.from("avatars").getPublicUrl(fileName)

  const { error } = await supabase
    .from("user_profiles")
    .update({ avatar: data.publicUrl })
    .eq("user_id", userId)

  if (error) throw toRequestError(error, "Profile")
}
