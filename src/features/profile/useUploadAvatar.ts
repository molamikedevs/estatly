import { uploadAvatarApi } from "@/api/apiProfile"
import { resizeImage } from "@/lib/resizeImage"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"

export const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"]

// Guard against huge files that could freeze the tab while resizing
const HARD_MAX_SIZE = 25 * 1024 * 1024

export function useUploadAvatar() {
  const queryClient = useQueryClient()
  const [isProcessing, setIsProcessing] = useState(false)

  const { isPending, mutate: upload } = useMutation({
    mutationFn: uploadAvatarApi,

    onSuccess: () => {
      toast.success("Photo updated")
      queryClient.invalidateQueries({ queryKey: ["user"] })
      queryClient.invalidateQueries({ queryKey: ["team"] })
    },

    onError: (err) => toast.error(err.message),
  })

  async function selectFile(file: File) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Use a JPG, PNG or WebP image")
      return
    }
    if (file.size > HARD_MAX_SIZE) {
      toast.error("That image is too large")
      return
    }

    // Shrink in the browser before uploading (see lib/resizeImage)
    setIsProcessing(true)
    try {
      upload(await resizeImage(file))
    } catch {
      toast.error("That image could not be read. Try another one")
    } finally {
      setIsProcessing(false)
    }
  }

  return { selectFile, isProcessing, isBusy: isProcessing || isPending }
}
