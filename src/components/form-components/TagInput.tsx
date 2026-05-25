import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, X } from "lucide-react"
import { useState } from "react"

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
}

export default function TagInput({
  value,
  onChange,
  placeholder = "Type and press Enter",
}: TagInputProps) {
  const [draft, setDraft] = useState("")

  function addTag() {
    const trimmed = draft.trim()
    if (!trimmed) return
    if (value.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
      setDraft("")
      return
    }
    onChange([...value, trimmed])
    setDraft("")
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag))
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
    if (e.key === "Backspace" && !draft && value.length) {
      removeTag(value[value.length - 1])
    }
  }

  return (
    <div className="space-y-2.5">
      <div className="relative">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="h-10 pr-10"
        />
        <button
          type="button"
          onClick={addTag}
          disabled={!draft.trim()}
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40"
          aria-label="Add"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="gap-1 border-0 bg-muted py-1 pr-1 pl-2.5 font-normal"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-background hover:text-destructive"
                aria-label={`Remove ${tag}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
