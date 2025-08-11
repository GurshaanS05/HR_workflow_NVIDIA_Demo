import type { Transfer } from "@/lib/types"

export function exportTransfersToCsv(transfers: Transfer[]) {
  const headers = [
    "id",
    "employeeName",
    "employeeEmail",
    "currentLocation",
    "targetLocation",
    "managerName",
    "managerEmail",
    "owningHRBP",
    "globalHRBP",
    "org3Lead",
    "compPartner",
    "mobilityPartner",
    "businessJustification",
    "proposedSalaryChange",
    "relocationCostEstimate",
    "createdAt",
    "updatedAt",
    "status",
  ]

  const rows = transfers.map((t) =>
    headers
      .map((h) => {
        const v = (t as any)[h] ?? ""
        const cell = typeof v === "string" ? v.replaceAll('"', '""') : String(v)
        return `"${cell}"`
      })
      .join(",")
  )

  const csv = [headers.join(","), ...rows].join("\n")
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = "transfers.csv"
  link.click()
  URL.revokeObjectURL(url)
}
