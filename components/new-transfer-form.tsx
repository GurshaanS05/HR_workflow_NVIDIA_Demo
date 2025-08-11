"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { useTransfersStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function NewTransferForm() {
  const { addTransfer } = useTransfersStore()
  const { toast } = useToast()
  const router = useRouter()
  const [form, setForm] = useState({
    employeeName: "",
    employeeEmail: "",
    currentLocation: "",
    targetLocation: "",
    managerName: "",
    managerEmail: "",
    owningHRBP: "",
    globalHRBP: "",
    org3Lead: "",
    compPartner: "",
    mobilityPartner: "",
    businessJustification: "",
    proposedSalaryChange: "",
    relocationCostEstimate: "",
  })

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const id = addTransfer({
      ...form,
    })
    toast({ title: "Transfer created", description: "New transfer has been created." })
    router.push(`/transfers/${id}`)
  }

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">New Transfer</h1>
      <Card className="rounded-2xl shadow-sm p-5 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input placeholder="Employee Name" required value={form.employeeName} onChange={(e) => set("employeeName", e.target.value)} />
          <Input placeholder="Employee Email" type="email" value={form.employeeEmail} onChange={(e) => set("employeeEmail", e.target.value)} />
          <Input placeholder="Current Location" value={form.currentLocation} onChange={(e) => set("currentLocation", e.target.value)} />
          <Input placeholder="Target Location" value={form.targetLocation} onChange={(e) => set("targetLocation", e.target.value)} />
          <Input placeholder="Manager Name" required value={form.managerName} onChange={(e) => set("managerName", e.target.value)} />
          <Input placeholder="Manager Email" type="email" value={form.managerEmail} onChange={(e) => set("managerEmail", e.target.value)} />
          <Input placeholder="Owning HRBP" required value={form.owningHRBP} onChange={(e) => set("owningHRBP", e.target.value)} />
          <Input placeholder="Global HRBP" value={form.globalHRBP} onChange={(e) => set("globalHRBP", e.target.value)} />
          <Input placeholder="Org3 Lead" value={form.org3Lead} onChange={(e) => set("org3Lead", e.target.value)} />
          <Input placeholder="Comp Partner" value={form.compPartner} onChange={(e) => set("compPartner", e.target.value)} />
          <Input placeholder="Mobility Partner" value={form.mobilityPartner} onChange={(e) => set("mobilityPartner", e.target.value)} />
          <Input placeholder="Proposed Salary Change" value={form.proposedSalaryChange} onChange={(e) => set("proposedSalaryChange", e.target.value)} />
          <Input placeholder="Relocation Cost Estimate" value={form.relocationCostEstimate} onChange={(e) => set("relocationCostEstimate", e.target.value)} />
          <div className="sm:col-span-2">
            <Textarea rows={5} placeholder="Business Justification" value={form.businessJustification} onChange={(e) => set("businessJustification", e.target.value)} />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="submit">Create Transfer</Button>
        </div>
      </Card>
    </form>
  )
}
