import { LanguagesIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useDirection } from "@/i18n/useDirection"

export function LanguageToggle({
  size = "sm",
  iconOnly = false,
}: {
  size?: "sm" | "icon-sm"
  iconOnly?: boolean
}) {
  const { language, setLanguage } = useDirection()
  const next = language === "ar" ? "en" : "ar"
  const label = language === "ar" ? "English" : "العربية"

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={() => setLanguage(next)}
    >
      <LanguagesIcon />
      {iconOnly ? <span className="sr-only">{label}</span> : label}
    </Button>
  )
}
