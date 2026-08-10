import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"

export function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-3 text-center">
      <p className="text-sm font-medium text-muted-foreground">
        {t("notFound.code")}
      </p>
      <h1 className="text-xl font-semibold">{t("notFound.title")}</h1>
      <Button render={<Link to="/employees" />}>
        {t("notFound.backToDashboard")}
      </Button>
    </div>
  )
}
