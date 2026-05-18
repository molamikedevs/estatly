import SpinnerMini from "@/components/SpinnerMini"
import { Button } from "@/components/ui/button"
import { useLogout } from "@/features/auth/useLogout"
import { LogOut } from "lucide-react"

export default function Logout() {
  const { isPending, logout } = useLogout()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => logout()}
      disabled={isPending}
      aria-label="Sign out"
      title="Sign out"
      className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
    >
      {isPending ? (
        <SpinnerMini size="sm" />
      ) : (
        <LogOut className="h-[18px] w-[18px]" />
      )}
    </Button>
  )
}
