import {
  BuildingIcon,
  HandCoinsIcon,
  LogOutIcon,
  StoreIcon,
  UsersIcon,
} from "lucide-react"
import { NavLink, Outlet } from "react-router-dom"

import { useAuth } from "@/auth/useAuth"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { to: "/employees", label: "Employees", icon: UsersIcon },
  { to: "/shops", label: "Shops", icon: StoreIcon },
  { to: "/rentals", label: "Rentals", icon: BuildingIcon },
  { to: "/debts", label: "Debts", icon: HandCoinsIcon },
]

function NavLinks({ className }: { className?: string }) {
  return (
    <nav className={cn("flex gap-1", className)}>
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
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
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

export function AppLayout() {
  const { user, signOut } = useAuth()

  const initials = user?.email.slice(0, 2).toUpperCase() ?? "CA"

  return (
    <div className="flex min-h-svh flex-col md:flex-row">
      <aside className="hidden shrink-0 flex-col border-r p-4 md:flex md:w-60">
        <div className="mb-6 font-heading text-lg font-semibold">
          Customer Admin
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
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOutIcon />
            Sign out
          </Button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b p-3 md:hidden">
          <span className="font-heading text-base font-semibold">
            Customer Admin
          </span>
          <Button variant="ghost" size="icon-sm" onClick={signOut}>
            <LogOutIcon />
            <span className="sr-only">Sign out</span>
          </Button>
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
