import { useUpdateProfile } from "@/features/auth/useUpdateProfile"
import { useUser } from "@/features/auth/useUser"
import { resizeImage } from "@/lib/resizeImage"
import { useRef, useState } from "react"
import { toast } from "sonner"

// A guard against absurd inputs
// (e.g. a 100MB file) that could stall or crash the browser tab.
const HARD_MAX_SIZE = 25 * 1024 * 1024

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"]

export function useAvatar() {
  const { user } = useUser()
  const { updateProfile, isPending } = useUpdateProfile()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const profile = user?.user_profile
  const displayName = profile?.full_name || user?.email || "User"

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    // Reset immediately so picking the same file again still fires onChange.
    if (fileInputRef.current) fileInputRef.current.value = ""
    if (!file) return

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Use a JPG, PNG or WebP image")
      return
    }
    if (file.size > HARD_MAX_SIZE) {
      toast.error("That image is too large to process")
      return
    }

    // Downscale whatever the user picked before uploading.
    setIsProcessing(true)
    try {
      const optimized = await resizeImage(file)
      updateProfile({ avatar: optimized })
    } catch {
      toast.error("Couldn't process that image — try another one")
    } finally {
      setIsProcessing(false)
    }
  }

  return {
    isPending,
    isProcessing,
    isBusy: isPending || isProcessing,
    displayName,
    handleFileChange,
    ACCEPTED_TYPES,
    profile,
    fileInputRef,
  }
}
