import {
  BuildingIcon,
  CoinsIcon,
  HandCoinsIcon,
  LogOutIcon,
  ReceiptIcon,
  ScrollTextIcon,
  StoreIcon,
  UsersIcon,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { NavLink, Outlet } from "react-router-dom"

import { useAuth } from "@/auth/useAuth"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { LanguageToggle } from "@/components/layout/LanguageToggle"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { to: "/employees", labelKey: "nav.employees", icon: UsersIcon },
  { to: "/shops", labelKey: "nav.shops", icon: StoreIcon },
  { to: "/rentals", labelKey: "nav.rentals", icon: BuildingIcon },
  { to: "/debts", labelKey: "nav.debts", icon: HandCoinsIcon },
  { to: "/receivables", labelKey: "nav.receivables", icon: CoinsIcon },
  { to: "/expenses", labelKey: "nav.expenses", icon: ReceiptIcon },
  { to: "/licenses", labelKey: "nav.licenses", icon: ScrollTextIcon },
]

function NavLinks({ className }: { className?: string }) {
  const { t } = useTranslation()

  return (
    <nav className={cn("flex gap-1", className)}>
      {NAV_ITEMS.map(({ to, labelKey, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )
          }
        >
          <Icon className="size-4" />
          {t(labelKey)}
        </NavLink>
      ))}
    </nav>
  )
}

export function AppLayout() {
  const { t } = useTranslation()
  const { user, signOut } = useAuth()

  const initials = user?.email.slice(0, 2).toUpperCase() ?? "CA"

  return (
    <div className="flex min-h-svh flex-col md:flex-row">
      <aside className="hidden shrink-0 flex-col border-e p-4 md:flex md:w-60">
        <div className="mb-6 font-heading text-lg font-semibold">
          {t("nav.brand")}
        </div>
        <NavLinks className="flex-col" />
        <div className="mt-auto flex flex-col gap-3 pt-4">
          <Separator />
          <div className="flex items-center gap-2">
            <Avatar size="sm">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <span className="truncate text-sm text-muted-foreground">
              {user?.email}
            </span>
          </div>
          <LanguageToggle />
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOutIcon />
            {t("nav.signOut")}
          </Button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b p-3 md:hidden">
          <span className="font-heading text-base font-semibold">
            {t("nav.brand")}
          </span>
          <div className="flex items-center gap-1">
            <LanguageToggle size="icon-sm" iconOnly />
            <Button variant="ghost" size="icon-sm" onClick={signOut}>
              <LogOutIcon />
              <span className="sr-only">{t("nav.signOut")}</span>
            </Button>
          </div>
        </header>
        <div className="overflow-x-auto border-b p-2 md:hidden">
          <NavLinks />
        </div>

        <main className="flex-1 overflow-x-hidden p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
