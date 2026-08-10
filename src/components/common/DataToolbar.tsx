import { SearchIcon } from "lucide-react"
import { useTranslation } from "react-i18next"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

export function DataToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  children,
}: {
  searchValue: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  children?: React.ReactNode
}) {
  const { t } = useTranslation()

  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <InputGroup className="sm:max-w-xs">
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput
          placeholder={searchPlaceholder ?? t("common.search")}
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </InputGroup>
      {children}
    </div>
  )
}
