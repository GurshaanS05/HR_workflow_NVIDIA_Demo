"use client"

import { Card } from "@/components/ui/card"
import { useEffect, useMemo } from "react"
import { useTransfersStore } from "@/lib/store"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { formatDistanceToNowStrict } from "@/lib/util-dates"
import { StatusDistribution } from "@/components/status-distribution" // Import the new component

// Updated STATUS_COLORS to match the screenshot more precisely with hex values
const STATUS_COLORS: Record<string, string> = {
  "1. Initiated": "#D1D5DB", // Light Gray
  "2. Package Prep": "#6B7280", // Darker Gray
  "3. Logistics Check": "#F59E0B", // Orange/Yellow
  "4. Awaiting Approvals": "#8B5CF6", // Purple/Blue
  "5. Awaiting Letter": "#A78BFA", // Violet
  "6. Closed": "#10B981", // Green
}

// Define the order of statuses for the pie chart to match the screenshot visually
const STATUS_DISPLAY_ORDER = [
  "1. Initiated",
  "2. Package Prep",
  "3. Logistics Check",
  "4. Awaiting Approvals",
  "5. Awaiting Letter",
  "6. Closed",
]

export default function Dashboard() {
  const { transfers, seedIfEmpty } = useTransfersStore()

  useEffect(() => {
    seedIfEmpty()
  }, [seedIfEmpty])

  const kpis = useMemo(() => {
    const total = transfers.length
    const initiated = transfers.filter((t) => t.status === "1. Initiated").length
    const awaitingApprovals = transfers.filter((t) => t.status === "4. Awaiting Approvals").length
    const closed = transfers.filter((t) => t.status === "6. Closed").length
    return { total, initiated, awaitingApprovals, closed }
  }, [transfers])

  const byStatus = useMemo(() => {
    const map: Record<string, number> = {}
    transfers.forEach((t) => {
      map[t.status] = (map[t.status] ?? 0) + 1
    })
    // Sort the data according to the defined display order, ensuring all statuses are present
    return STATUS_DISPLAY_ORDER.map((status) => ({
      name: status,
      value: map[status] ?? 0, // Include status even if count is 0
    }))
  }, [transfers])

  const recentActivity = useMemo(() => {
    return transfers
      .flatMap((t) => t.activity.map((a) => ({ ...a, transferId: t.id, employeeName: t.employeeName })))
      .sort((a, b) => b.ts.localeCompare(a.ts))
      .slice(0, 6)
  }, [transfers])

  const totalTransfers = transfers.length

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {" "}
        {/* Adjusted grid-cols to 4 */}
        <KpiCard title="Total Active" value={kpis.total} />
        <KpiCard title="Initiated" value={kpis.initiated} />
        <KpiCard title="Awaiting Approvals" value={kpis.awaitingApprovals} />
        <KpiCard title="Closed" value={kpis.closed} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl shadow-sm p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Transfers by Status</h2>
          </div>
          <StatusDistribution data={byStatus} totalTransfers={totalTransfers} colors={STATUS_COLORS} />
        </Card>

        <Card className="rounded-2xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/transfers">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="space-y-3">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start justify-between">
                <div className="min-w-0">
                  <div className="font-medium truncate">{a.employeeName}</div>
                  <div className="text-sm text-muted-foreground truncate">{a.action}</div>
                </div>
                <div className="text-xs text-muted-foreground ml-3 shrink-0">{formatDistanceToNowStrict(a.ts)}</div>
              </div>
            ))}
            {recentActivity.length === 0 && <div className="text-sm text-muted-foreground">No recent activity.</div>}
          </div>
        </Card>
      </div>
    </div>
  )
}

function KpiCard({ title, value }: { title: string; value: number }) {
  return (
    <Card className="rounded-2xl shadow-sm p-4 flex flex-col justify-between h-full">
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="text-3xl font-semibold">{value}</div>
    </Card>
  )
}
