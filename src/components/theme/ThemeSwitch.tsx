import { useTheme } from "@/components/theme/theme-provider"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Moon, Sun } from "lucide-react"

interface ThemeSwitchProps {
  variant?: "ghost" | "outline"
  className?: string
}

export default function ThemeSwitch({
  variant = "ghost",
  className,
}: ThemeSwitchProps) {
  const { theme, setTheme } = useTheme()
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)

  const toggle = () => setTheme(isDark ? "light" : "dark")

  return (
    <Button
      variant={variant}
      size="icon"
      onClick={toggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={cn("relative cursor-pointer", className)}
    >
      <Sun className="h-[18px] w-[18px] scale-100 rotate-0 transition-all duration-300 dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-[18px] w-[18px] scale-0 rotate-90 transition-all duration-300 dark:scale-100 dark:rotate-0" />
    </Button>
  )
}
