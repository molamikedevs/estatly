import { updatePropertyApi } from "@/api/apiProperties"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useUpdateProperty() {
  const queryClient = useQueryClient()

  const { isPending, mutate: updateProperty } = useMutation({
    mutationFn: updatePropertyApi,

    onSuccess: () => {
      toast.success("Property updated")
      queryClient.invalidateQueries({ queryKey: ["properties"] })
      queryClient.invalidateQueries({ queryKey: ["property"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
      queryClient.invalidateQueries({ queryKey: ["viewings"] })
    },

    onError: (err) => toast.error(err.message),
  })

  return { isPending, updateProperty }
}
