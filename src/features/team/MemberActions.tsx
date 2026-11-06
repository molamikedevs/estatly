import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { TeamMember } from "@/types/database"
import { MoreHorizontal, Pencil, UserCheck, UserX } from "lucide-react"

interface MemberActionsProps {
  member: TeamMember
  onEdit: () => void
  onToggleActive: () => void
}

export default function MemberActions({
  member,
  onEdit,
  onToggleActive,
}: MemberActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="-mt-1 -mr-2 size-9 shrink-0 text-muted-foreground"
          aria-label={`Actions for ${member.full_name}`}
        >
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onSelect={onEdit}>
          <Pencil />
          Edit details
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {member.is_active ? (
          <DropdownMenuItem variant="destructive" onSelect={onToggleActive}>
            <UserX />
            Deactivate
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onSelect={onToggleActive}>
            <UserCheck />
            Reactivate
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
