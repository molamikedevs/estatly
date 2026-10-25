import { updateAgencySettingsApi } from "@/api/apiSettings"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useUpdateSettings() {
  const queryClient = useQueryClient()

  const { isPending, mutate: updateSettings } = useMutation({
    mutationFn: updateAgencySettingsApi,

    onSuccess: () => {
      toast.success("Settings saved")
      queryClient.invalidateQueries({ queryKey: ["settings"] })
    },

    onError: (err) => toast.error(err.message),
  })

  return { isPending, updateSettings }
}
