import { createPropertyApi } from "@/api/apiProperties"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useCreateProperty() {
  const queryClient = useQueryClient()

  const { isPending, mutate: createProperty } = useMutation({
    mutationFn: createPropertyApi,

    onSuccess: () => {
      toast.success("Property added. It goes live once approved")
      queryClient.invalidateQueries({ queryKey: ["properties"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
      queryClient.invalidateQueries({ queryKey: ["team"] })
    },

    onError: (err) => toast.error(err.message),
  })

  return { isPending, createProperty }
}
