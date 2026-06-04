import { createAgentSchema } from "@/lib/validation"
import type { CreateAgentFormValues } from "@/types/global"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { FormFooter } from "../auth/FormFooter"
import ManagerFields from "./ManagerFields"
import { useCreateManager } from "./useCreateManager"

interface ManagerFormProps {
  onClose: () => void
}

/**
 * The agent-creation form itself, without any sheet shell. The
 * parent (AgentList) wraps it in a FormSheet.
 */
export default function ManagerForm({ onClose }: ManagerFormProps) {
  const { createManager, isPending } = useCreateManager()

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isValid },
  } = useForm<CreateAgentFormValues>({
    resolver: zodResolver(createAgentSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      role: "manager",
    },
  })

  const onSubmit = handleSubmit((values) => {
    createManager(values, {
      onSuccess: () => {
        reset()
        onClose()
      },
    })
  })

  function handleCancel() {
    reset()
    onClose()
  }

  const canSave = isDirty && isValid && !isPending

  return (
    <form onSubmit={onSubmit} className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 scrollbar-thin overflow-y-auto px-6 py-6">
        <ManagerFields control={control} />
      </div>

      <FormFooter
        canSave={canSave}
        isSubmitting={isPending}
        onCancel={handleCancel}
        submitLabel="Create Manager"
        submittingLabel="Creating…"
      />
    </form>
  )
}
