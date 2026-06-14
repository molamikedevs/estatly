import { updatePropertyApi } from "@/api/apiProperties"
import type { PropertyFormValues } from "@/types/global"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useUpdateProperty() {
  const queryClient = useQueryClient()

  const { isPending, mutate: updateProperty } = useMutation({
    mutationFn: ({
      newProperty,
      id,
    }: {
      newProperty: PropertyFormValues
      id: string
    }) => updatePropertyApi(newProperty, id),

    onSuccess: () => {
      toast.success("Property successfully updated")
      queryClient.invalidateQueries({ queryKey: ["properties"] })
      queryClient.invalidateQueries({ queryKey: ["property"] })
    },

    onError: (err) => toast.error(err.message),
  })

  return { isPending, updateProperty }
}
