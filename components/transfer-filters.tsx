"use client"

import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Filter } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Status } from "@/lib/types"

const ALL_STATUSES: Status[] = [
  "1. Initiated",
  "2. Package Prep",
  "3. Logistics Check",
  "4. Awaiting Approvals",
  "5. Awaiting Letter",
  "6. Closed",
]

export function TransferToolbar(props: {
  query: string
  onQueryChange: (v: string) => void
  statusFilter: string[]
  onStatusFilterChange: (v: string[]) => void
  hrbps: string[]
  hrbpFilter: string | ""
  onHrbpFilterChange: (v: string | "") => void
}) {
  const { query, onQueryChange, statusFilter, onStatusFilterChange, hrbps, hrbpFilter, onHrbpFilterChange } = props

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <Input
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Search by employee"
        className="w-full sm:w-72"
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="justify-start">
            <Filter className="mr-2 h-4 w-4" />
            Status
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Status Filter</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {ALL_STATUSES.map((s) => (
            <DropdownMenuCheckboxItem
              key={s}
              checked={statusFilter.includes(s)}
              onCheckedChange={(checked) => {
                if (checked) onStatusFilterChange([...statusFilter, s])
                else onStatusFilterChange(statusFilter.filter((x) => x !== s))
              }}
            >
              {s}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Select
        value={hrbpFilter || "all"}
        onValueChange={(v) => onHrbpFilterChange(v === "all" ? "" : v)}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Owning HRBP" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All HRBPs</SelectItem>
          {hrbps.map((h) => (
            <SelectItem key={h} value={h}>
              {h}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
