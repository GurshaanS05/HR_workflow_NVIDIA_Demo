"use client"

import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu"

import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { StatusBadge } from "@/components/status-badge"
import { formatShortDate } from "@/lib/util-dates"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTransfersStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { getApprovalStakeholders, getStatusStakeholders } from "@/lib/notifications"
import type { Transfer, Status } from "@/lib/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function TransferTable({
  data,
  page,
  totalPages,
  onPageChange,
}: {
  data: Transfer[]
  page: number
  totalPages: number
  onPageChange: (p: number) => void
}) {
  const { toast } = useToast()
  const { changeStatus, requestApprovals, deleteTransfer } = useTransfersStore()

  const handleStatusChange = (t: Transfer, s: Status) => {
    const { recipients, missing } = getStatusStakeholders(t, s)
    changeStatus(t.id, s, `Status changed to ${s}; emailed ${recipients.length ? recipients.join(", ") : "no one"}`)
    if (recipients.length) {
      toast({ title: "Notifications sent", description: `Emails sent to: ${recipients.join(", ")}` })
    }
    if (missing.length) {
      toast({
        title: "Missing stakeholder emails",
        description: `No email for: ${missing.join(", ")}`,
        variant: "destructive",
      })
    }
  }

  const handleRequestApprovals = (t: Transfer) => {
    const recipients = getApprovalStakeholders(t)
    requestApprovals(t.id)
    toast({
      title: "Approval request sent",
      description: `Sent to: ${recipients.join(", ")}`,
    })
  }

  const handleDeleteTransfer = (id: string, employeeName: string) => {
    deleteTransfer(id)
    toast({
      title: "Transfer deleted",
      description: `Transfer for ${employeeName} has been removed.`,
    })
  }

  return (
    <Card className="rounded-2xl shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Employee</TableHead>
              <TableHead>Owning HRBP</TableHead>
              <TableHead>Manager</TableHead>
              <TableHead>Target Location</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((t) => (
              <TableRow key={t.id} className="hover:bg-muted/50">
                <TableCell>
                  <StatusBadge status={t.status} />
                </TableCell>
                <TableCell className="font-medium">
                  <Link href={`/transfers/${t.id}`} className="hover:underline">
                    {t.employeeName}
                  </Link>
                </TableCell>
                <TableCell>{t.owningHRBP}</TableCell>
                <TableCell>{t.managerName}</TableCell>
                <TableCell>{t.targetLocation || "-"}</TableCell>
                <TableCell>{formatShortDate(t.updatedAt)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem asChild>
                        <Link href={`/transfers/${t.id}`}>View / Edit</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRequestApprovals(t)}>Request Approvals</DropdownMenuItem>
                      <div className="px-2 py-1.5 text-xs text-muted-foreground">Change Status</div>
                      {[
                        "1. Initiated",
                        "2. Package Prep",
                        "3. Logistics Check",
                        "4. Awaiting Approvals",
                        "5. Awaiting Letter",
                        "6. Closed",
                      ].map((s) => (
                        <DropdownMenuItem key={s} onClick={() => handleStatusChange(t, s as any)}>
                          {s}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          {/* Re-added onSelect={(e) => e.preventDefault()} to prevent dropdown from closing prematurely */}
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className="text-destructive focus:text-destructive"
                          >
                            Delete
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the transfer for{" "}
                              <span className="font-semibold">{t.employeeName}</span>.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteTransfer(t.id, t.employeeName)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-10">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between p-3">
        <div className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            Prev
          </Button>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
