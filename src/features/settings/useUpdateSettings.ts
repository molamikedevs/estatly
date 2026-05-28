import { updateAgencyApi } from "@/api/apiSettings"
import type { SettingsFormValues } from "@/types/global"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useUpdateSettings() {
  const queryClient = useQueryClient()
  const { isPending, mutate: updateSettings } = useMutation({
    mutationFn: ({ id, values }: { id: number; values: SettingsFormValues }) =>
      updateAgencyApi(id, values),

    onSuccess: () => {
      toast.success("Agency settings successfully updated")
      queryClient.invalidateQueries({ queryKey: ["settings"] })
    },

    onError: (err) => {
      toast.error("Failed to update settings")
      console.error(err.message)
    },
  })

  return { isPending, updateSettings }
}
