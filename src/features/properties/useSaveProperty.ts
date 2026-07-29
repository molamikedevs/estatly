import { createPropertyApi, updatePropertyApi } from "@/api/apiProperties"
import type { EditPropertyFormValues, PropertyFormValues } from "@/types/global"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useSaveProperty(isEdit: boolean) {
  const queryClient = useQueryClient()

  const { isPending, mutate: saveProperty } = useMutation({
    mutationFn: (params: PropertyFormValues | EditPropertyFormValues) =>
      isEdit
        ? updatePropertyApi(params as EditPropertyFormValues)
        : createPropertyApi(params as PropertyFormValues),

    onSuccess: () => {
      toast.success(`Property successfully ${isEdit ? "updated" : "created"}`)
      queryClient.invalidateQueries({ queryKey: ["properties"] })
      if (isEdit) queryClient.invalidateQueries({ queryKey: ["property"] })
    },

    onError: (err) => toast.error(err.message),
  })

  return { isPending, saveProperty }
}
