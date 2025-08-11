"use client"

import type React from "react"

import { useMemo, useState, useEffect } from "react"
import { useTransfersStore } from "@/lib/store"
import { Card } from "@/components/ui/card"
import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { getApprovalStakeholders, getStatusStakeholders } from "@/lib/notifications"
import type { Status, Transfer } from "@/lib/types"

export default function TransferDetail({ id }: { id: string }) {
  const { transfers, changeStatus, requestApprovals, updateTransfer } = useTransfersStore()
  const t = useMemo(() => transfers.find((x) => x.id === id), [transfers, id])
  const { toast } = useToast()

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<Transfer>>({})

  useEffect(() => {
    if (t) {
      setFormData(t)
    }
  }, [t])

  if (!t) return <div className="text-sm text-muted-foreground">Transfer not found.</div>

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const onChangeStatus = (s: Status) => {
    const { recipients, missing } = getStatusStakeholders(t, s)
    changeStatus(t.id, s, `Status changed to ${s}; emailed ${recipients.length ? recipients.join(", ") : "no one"}`)
    if (recipients.length) {
      toast({ title: "Notifications sent", description: `Emails sent to: ${recipients.join(", ")}` })
    }
    if (missing.length) {
      toast({
        title: "Missing stakeholder emails",
        description: `Missing: ${missing.join(", ")}`,
        variant: "destructive",
      })
    }
  }

  const onRequestApprovals = () => {
    const recipients = getApprovalStakeholders(t)
    requestApprovals(t.id)
    toast({ title: "Approval request sent", description: `Sent to: ${recipients.join(", ")}` })
  }

  const handleSave = () => {
    updateTransfer(t.id, formData)
    setIsEditing(false)
    toast({ title: "Transfer updated", description: "Transfer details have been saved." })
  }

  const handleCancel = () => {
    setFormData(t) // Revert to original data
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t.employeeName}</h1>
          <div className="text-sm text-muted-foreground">{t.employeeEmail || "-"}</div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={t.status} />
          <Select defaultValue={t.status} onValueChange={(v) => onChangeStatus(v as Status)}>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Change Status" />
            </SelectTrigger>
            <SelectContent>
              {[
                "1. Initiated",
                "2. Package Prep",
                "3. Logistics Check",
                "4. Awaiting Approvals",
                "5. Awaiting Letter",
                "6. Closed",
              ].map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={onRequestApprovals}>Request Approvals</Button>
          {!isEditing ? (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          ) : (
            <>
              <Button onClick={handleSave}>Save</Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="package">Package</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card className="rounded-2xl shadow-sm p-5 grid gap-4 sm:grid-cols-2">
            <Field
              label="Employee Name"
              name="employeeName"
              value={formData.employeeName}
              onChange={handleInputChange}
              isEditing={isEditing}
              required
            />
            <Field
              label="Employee Email"
              name="employeeEmail"
              value={formData.employeeEmail}
              onChange={handleInputChange}
              isEditing={isEditing}
              type="email"
            />
            <Field
              label="Current Location"
              name="currentLocation"
              value={formData.currentLocation}
              onChange={handleInputChange}
              isEditing={isEditing}
            />
            <Field
              label="Target Location"
              name="targetLocation"
              value={formData.targetLocation}
              onChange={handleInputChange}
              isEditing={isEditing}
            />
            <Field
              label="Manager Name"
              name="managerName"
              value={formData.managerName}
              onChange={handleInputChange}
              isEditing={isEditing}
              required
            />
            <Field
              label="Manager Email"
              name="managerEmail"
              value={formData.managerEmail}
              onChange={handleInputChange}
              isEditing={isEditing}
              type="email"
            />
            <Field
              label="Owning HRBP"
              name="owningHRBP"
              value={formData.owningHRBP}
              onChange={handleInputChange}
              isEditing={isEditing}
              required
            />
            <Field
              label="Global HRBP"
              name="globalHRBP"
              value={formData.globalHRBP}
              onChange={handleInputChange}
              isEditing={isEditing}
            />
            <Field
              label="Org3 Lead"
              name="org3Lead"
              value={formData.org3Lead}
              onChange={handleInputChange}
              isEditing={isEditing}
            />
            <Field
              label="Comp Partner"
              name="compPartner"
              value={formData.compPartner}
              onChange={handleInputChange}
              isEditing={isEditing}
            />
            <Field
              label="Mobility Partner"
              name="mobilityPartner"
              value={formData.mobilityPartner}
              onChange={handleInputChange}
              isEditing={isEditing}
            />
            <div className="sm:col-span-2">
              <div className="text-sm font-medium">Business Justification</div>
              {isEditing ? (
                <Textarea
                  name="businessJustification"
                  rows={5}
                  value={formData.businessJustification || ""}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {t.businessJustification || "-"}
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="activity">
          <Card className="rounded-2xl shadow-sm p-5 space-y-4">
            {t.activity
              .slice()
              .sort((a, b) => b.ts.localeCompare(a.ts))
              .map((a, i) => (
                <div key={i} className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-medium">{a.actor}</div>
                    <div className="text-sm text-muted-foreground">{a.action}</div>
                    {a.notes && <div className="text-xs text-muted-foreground mt-1">{a.notes}</div>}
                  </div>
                  <div className="text-xs text-muted-foreground">{new Date(a.ts).toLocaleString()}</div>
                </div>
              ))}
            {t.activity.length === 0 && <div className="text-sm text-muted-foreground">No activity yet.</div>}
          </Card>
        </TabsContent>
        <TabsContent value="package">
          <Card className="rounded-2xl shadow-sm p-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Proposed Salary Change"
                name="proposedSalaryChange"
                value={formData.proposedSalaryChange}
                onChange={handleInputChange}
                isEditing={isEditing}
              />
              <Field
                label="Relocation Cost Estimate"
                name="relocationCostEstimate"
                value={formData.relocationCostEstimate}
                onChange={handleInputChange}
                isEditing={isEditing}
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={!isEditing}>
                Save Package
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function Field({
  label,
  name,
  value,
  onChange,
  isEditing,
  type = "text",
  required = false,
}: {
  label: string
  name: keyof Transfer
  value?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  isEditing: boolean
  type?: string
  required?: boolean
}) {
  return (
    <div>
      <div className="text-sm font-medium">{label}</div>
      {isEditing ? (
        <Input name={name} value={value || ""} onChange={onChange} type={type} required={required} />
      ) : (
        <div className="text-sm text-muted-foreground">{value || "-"}</div>
      )}
    </div>
  )
}
