import { createViewingApi } from "@/api/apiViewings"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useCreateViewing() {
  const queryClient = useQueryClient()

  const { isPending, mutate: createViewing } = useMutation({
    mutationFn: createViewingApi,

    onSuccess: () => {
      toast.success("Viewing successfully created")
      queryClient.invalidateQueries({ queryKey: ["viewings"] })
    },

    onError: (err) => {
      toast.error(err.message)
    },
  })

  return { isPending, createViewing }
}
