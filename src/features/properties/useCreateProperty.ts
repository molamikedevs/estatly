import { createPropertyApi } from "@/api/apiProperties"
import type { PropertyFormValues } from "@/types/global"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useCreateProperty() {
  const queryClient = useQueryClient()

  const { isPending, mutate: createProperty } = useMutation({
    mutationFn: (newProperty: PropertyFormValues) =>
      createPropertyApi(newProperty),

    onSuccess: () => {
      toast.success("Property successfully created")
      queryClient.invalidateQueries({ queryKey: ["properties"] })
    },

    onError: (err) => toast.error(err.message),
  })

  return { isPending, createProperty }
}
