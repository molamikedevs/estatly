import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface BackLinkProps {
  route: string
  label: string
}

export default function BackLink({ route, label }: BackLinkProps) {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate(`/${route}`)}
      className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </button>
  )
}
