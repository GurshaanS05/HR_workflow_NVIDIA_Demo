import { Badge } from "@/components/ui/badge"
import type { Status } from "@/lib/types"
import { cn } from "@/lib/utils"

export function StatusBadge({ status }: { status: Status }) {
  const className = cn(
    "rounded-full",
    status === "1. Initiated" && "bg-gray-200 text-gray-800",
    status === "2. Package Prep" && "bg-slate-200 text-slate-800",
    status === "3. Logistics Check" && "bg-amber-200 text-amber-900",
    status === "4. Awaiting Approvals" && "bg-indigo-200 text-indigo-900",
    status === "5. Awaiting Letter" && "bg-violet-200 text-violet-900",
    status === "6. Closed" && "bg-emerald-200 text-emerald-900"
  )
  return <Badge className={className}>{status}</Badge>
}
