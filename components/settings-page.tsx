"use client"

import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useTransfersStore } from "@/lib/store"

export default function SettingsPage() {
  const { toast } = useToast()
  const { templates, saveTemplates } = useTransfersStore()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>

      <Card className="rounded-2xl shadow-sm p-5 space-y-3">
        <div className="text-lg font-semibold">Notification Rules</div>
        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
          <li>{'"1. Initiated"'} → notify Owning HRBP & Global HRBP</li>
          <li>{'"3. Logistics Check"'} → notify Comp & Mobility partners</li>
          <li>{'"5. Awaiting Letter"'} → notify Mobility partner</li>
        </ul>
        <div className="text-xs text-muted-foreground">
          Sidebar and layout follow shadcn Sidebar usage for consistent UX [^3].
        </div>
      </Card>

      <Card className="rounded-2xl shadow-sm p-5 space-y-4">
        <div className="text-lg font-semibold">Email Templates</div>
        <div className="space-y-2">
          <div className="text-sm font-medium">Status Changed Notification</div>
          <Textarea
            rows={5}
            value={templates.statusChanged}
            onChange={(e) => saveTemplates({ statusChanged: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <div className="text-sm font-medium">Request Approvals Notification</div>
          <Textarea
            rows={5}
            value={templates.requestApprovals}
            onChange={(e) => saveTemplates({ requestApprovals: e.target.value })}
          />
        </div>
        <div className="flex justify-end">
          <Button
            onClick={() => {
              toast({ title: "Settings saved", description: "Templates updated." })
            }}
          >
            Save
          </Button>
        </div>
      </Card>
    </div>
  )
}
