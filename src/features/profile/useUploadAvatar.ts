import { uploadAvatarApi } from "@/api/apiProfile"
import { useUser } from "@/features/auth/useUser"
import { IMAGE_TYPES, MAX_IMAGE_SIZE } from "@/lib/constants"
import { refreshPeople } from "@/lib/refreshPeople"
import { resizeImage } from "@/lib/resizeImage"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"

export function useUploadAvatar() {
  const queryClient = useQueryClient()
  const { user } = useUser()
  const [isProcessing, setIsProcessing] = useState(false)

  const { isPending, mutate: upload } = useMutation({
    mutationFn: uploadAvatarApi,

    onSuccess: () => {
      toast.success("Photo updated")
      // Your photo shows across the app, not only on this page
      refreshPeople(queryClient)
    },

    onError: (err) => toast.error(err.message),
  })

  async function selectFile(file: File) {
    if (!IMAGE_TYPES.includes(file.type)) {
      toast.error("Use a JPG, PNG or WebP image")
      return
    }
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("That image is too large")
      return
    }

    // Shrink in the browser before uploading (see lib/resizeImage)
    setIsProcessing(true)
    try {
      const resized = await resizeImage(file)
      // The current photo is removed once the new one is saved
      upload({ file: resized, oldUrl: user?.user_profile?.avatar })
    } catch {
      toast.error("That image could not be read. Try another one")
    } finally {
      setIsProcessing(false)
    }
  }

  return { selectFile, isProcessing, isBusy: isProcessing || isPending }
}
