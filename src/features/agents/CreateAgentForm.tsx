import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

import { createAgentSchema } from "@/lib/validation"
import type { CreateAgentFormValues } from "@/types/index"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { FormFooter } from "../auth/FormFooter"
import AgentFields from "./AgentFields"
import { useCreateAgent } from "./useCreateAgent"

interface CreateAgentFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CreateAgentForm({
  open,
  onOpenChange,
}: CreateAgentFormProps) {
  const { createAgent, isPending } = useCreateAgent()

  const form = useForm<CreateAgentFormValues>({
    resolver: zodResolver(createAgentSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      role: "agent",
    },
  })
  const {
    formState: { isDirty, isValid },
    handleSubmit,
    reset,
    control,
  } = form

  function onSubmit(values: CreateAgentFormValues) {
    createAgent(values, {
      onSuccess: () => {
        reset()
        onOpenChange(false)
      },
    })
  }

  function handleOpenChange(next: boolean) {
    if (!next) reset()
    onOpenChange(next)
  }

  const canSave = isDirty && isValid && !isPending

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-lg"
      >
        <SheetHeader className="border-b px-6 py-5">
          <SheetTitle className="text-lg">Create new agent</SheetTitle>
          <SheetDescription className="text-xs">
            The agent will receive sign-in credentials and can immediately
            access the platform.
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 scrollbar-thin overflow-y-auto px-6 py-6">
            <AgentFields control={control} />
          </div>

          <FormFooter
            canSave={canSave}
            isSubmitting={isPending}
            onCancel={() => handleOpenChange(false)}
            submitLabel="Create Agent"
            submittingLabel="Creating…"
          />
        </form>
      </SheetContent>
    </Sheet>
  )
}
