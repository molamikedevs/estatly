import { createAgentSchema } from "@/lib/validation"
import type { CreateAgentFormValues } from "@/types/global"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { FormFooter } from "../auth/FormFooter"
import AgentFields from "./AgentFields"
import { useCreateAgent } from "./useCreateAgent"

interface AgentFormProps {
  onClose: () => void
}

/**
 * The agent-creation form itself, without any sheet shell. The
 * parent (AgentList) wraps it in a FormSheet.
 */
export default function AgentForm({ onClose }: AgentFormProps) {
  const { createAgent, isPending } = useCreateAgent()

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
      role: "agent",
    },
  })

  const onSubmit = handleSubmit((values) => {
    createAgent(values, {
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
        <AgentFields control={control} />
      </div>

      <FormFooter
        canSave={canSave}
        isSubmitting={isPending}
        onCancel={handleCancel}
        submitLabel="Create Agent"
        submittingLabel="Creating…"
      />
    </form>
  )
}
