"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { TransferToolbar } from "@/components/transfer-filters"
import TransferTable from "@/components/transfer-table"
import { useTransfersStore } from "@/lib/store"
import { exportTransfersToCsv } from "@/components/export-csv"
import { Plus, Download } from 'lucide-react'
import { Card } from "@/components/ui/card"

export default function TransfersPage() {
  const { transfers, seedIfEmpty } = useTransfersStore()
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [hrbpFilter, setHrbpFilter] = useState<string | "">("")
  const [page, setPage] = useState(1)
  const pageSize = 8

  useEffect(() => {
    seedIfEmpty()
  }, [seedIfEmpty])

  const filtered = useMemo(() => {
    let data = transfers
    if (query.trim()) {
      const q = query.toLowerCase()
      data = data.filter((t) => t.employeeName.toLowerCase().includes(q))
    }
    if (statusFilter.length) {
      data = data.filter((t) => statusFilter.includes(t.status))
    }
    if (hrbpFilter) {
      data = data.filter((t) => t.owningHRBP === hrbpFilter)
    }
    return data.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  }, [transfers, query, statusFilter, hrbpFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Transfers</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportTransfersToCsv(transfers)}>
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
          <Button asChild>
            <Link href="/transfers/new">
              <Plus className="mr-2 h-4 w-4" /> New Transfer
            </Link>
          </Button>
        </div>
      </div>

      <TransferToolbar
        query={query}
        onQueryChange={setQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        hrbps={[...new Set(transfers.map((t) => t.owningHRBP))].sort()}
        hrbpFilter={hrbpFilter}
        onHrbpFilterChange={setHrbpFilter}
      />

      {transfers.length === 0 ? (
        <Card className="rounded-2xl shadow-sm p-10 text-center">
          <p className="text-gray-500 mb-4">No transfers yet.</p>
          <Button asChild>
            <Link href="/transfers/new">Create first transfer</Link>
          </Button>
        </Card>
      ) : (
        <TransferTable data={paged} page={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </div>
  )
}
