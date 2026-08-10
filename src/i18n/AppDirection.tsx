import { useEffect, type ReactNode } from "react"
import { DirectionProvider } from "@base-ui/react/direction-provider"
import { useTranslation } from "react-i18next"

import { Toaster } from "@/components/ui/sonner"
import { useDirection } from "@/i18n/useDirection"

export function AppDirection({ children }: { children: ReactNode }) {
  const { t } = useTranslation()
  const { dir, isRtl, language } = useDirection()

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = dir
    document.title = t("nav.brand")
  }, [language, dir, t])

  return (
    <DirectionProvider direction={dir}>
      {children}
      <Toaster dir={dir} position={isRtl ? "top-left" : "top-right"} />
    </DirectionProvider>
  )
}
