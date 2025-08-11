"use client"
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import type { ActivityItem, Status, Templates, Transfer } from "./types"
import { seedTransfers } from "./seed"

type Store = {
  transfers: Transfer[]
  templates: Templates
  seedIfEmpty: () => void
  addTransfer: (
    payload: Partial<Transfer> & { employeeName: string; managerName: string; owningHRBP: string },
  ) => string
  changeStatus: (id: string, status: Status, note?: string) => void
  requestApprovals: (id: string) => void
  updateTransfer: (id: string, payload: Partial<Transfer>) => void // Updated to a more general update function
  deleteTransfer: (id: string) => void // Added delete function
  saveTemplates: (partial: Partial<Templates>) => void
}

const TransfersContext = createContext<Store | null>(null)

export function TransfersProvider({ children }: { children: ReactNode }) {
  const [transfers, setTransfers] = useState<Transfer[]>([])
  const [templates, setTemplates] = useState<Templates>({
    statusChanged:
      "Subject: Status update for {{employeeName}}\n\nThe transfer status has changed to {{status}}.\n\nThanks,\nHR Mobility",
    requestApprovals:
      "Subject: Approvals requested for {{employeeName}}\n\nPlease review and approve the transfer.\n\nThanks,\nHR Mobility",
  })

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("hr-mobility:transfers")
      const tmpl = localStorage.getItem("hr-mobility:templates")
      if (raw) setTransfers(JSON.parse(raw))
      if (tmpl) setTemplates(JSON.parse(tmpl))
    } catch (e) {
      // ignore
    }
  }, [])

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem("hr-mobility:transfers", JSON.stringify(transfers))
    } catch {}
  }, [transfers])
  useEffect(() => {
    try {
      localStorage.setItem("hr-mobility:templates", JSON.stringify(templates))
    } catch {}
  }, [templates])

  const seedIfEmpty = useCallback(() => {
    setTransfers((prev) => {
      if (prev.length) return prev
      return seedTransfers(12)
    })
  }, [])

  const addTransfer = useCallback(
    (payload: Partial<Transfer> & { employeeName: string; managerName: string; owningHRBP: string }) => {
      const now = new Date().toISOString()
      const t: Transfer = {
        id: crypto.randomUUID(),
        employeeName: payload.employeeName,
        employeeEmail: payload.employeeEmail,
        currentLocation: payload.currentLocation,
        targetLocation: payload.targetLocation,
        managerName: payload.managerName,
        managerEmail: payload.managerEmail,
        owningHRBP: payload.owningHRBP,
        globalHRBP: payload.globalHRBP,
        org3Lead: payload.org3Lead,
        compPartner: payload.compPartner,
        mobilityPartner: payload.mobilityPartner,
        businessJustification: payload.businessJustification,
        proposedSalaryChange: payload.proposedSalaryChange,
        relocationCostEstimate: payload.relocationCostEstimate,
        createdAt: now,
        updatedAt: now,
        status: "1. Initiated",
        activity: [{ ts: now, actor: "System", action: "Created transfer" }],
      }
      setTransfers((arr) => [t, ...arr])
      return t.id
    },
    [],
  )

  const pushActivity = (arr: Transfer[], id: string, item: ActivityItem): Transfer[] => {
    return arr.map((t) => (t.id === id ? { ...t, activity: [...t.activity, item], updatedAt: item.ts } : t))
  }

  const changeStatus = useCallback((id: string, status: Status, note?: string) => {
    const now = new Date().toISOString()
    setTransfers((arr) => {
      const updated = arr.map((t) => (t.id === id ? { ...t, status, updatedAt: now } : t))
      return pushActivity(updated, id, { ts: now, actor: "System", action: note || `Status changed to ${status}` })
    })
  }, [])

  const requestApprovals = useCallback((id: string) => {
    const now = new Date().toISOString()
    setTransfers((arr) => {
      const next = arr.map((t) =>
        t.id === id
          ? {
              ...t,
              status: t.status === "4. Awaiting Approvals" ? t.status : ("4. Awaiting Approvals" as Status),
              updatedAt: now,
            }
          : t,
      )
      const actorText = "Requested approvals from Manager, Org3 Lead, Global HRBP."
      return pushActivity(next, id, { ts: now, actor: "System", action: actorText })
    })
  }, [])

  const updateTransfer = useCallback((id: string, payload: Partial<Transfer>) => {
    const now = new Date().toISOString()
    setTransfers((arr) => {
      const updated = arr.map((t) => (t.id === id ? { ...t, ...payload, updatedAt: now } : t))
      return pushActivity(updated, id, { ts: now, actor: "System", action: "Updated transfer details" })
    })
  }, [])

  const deleteTransfer = useCallback((id: string) => {
    setTransfers((arr) => arr.filter((t) => t.id !== id))
  }, [])

  const saveTemplates = useCallback((partial: Partial<Templates>) => {
    setTemplates((t) => ({ ...t, ...partial }))
  }, [])

  const value = useMemo<Store>(
    () => ({
      transfers,
      templates,
      seedIfEmpty,
      addTransfer,
      changeStatus,
      requestApprovals,
      updateTransfer,
      deleteTransfer,
      saveTemplates,
    }),
    [
      transfers,
      templates,
      seedIfEmpty,
      addTransfer,
      changeStatus,
      requestApprovals,
      updateTransfer,
      deleteTransfer,
      saveTemplates,
    ],
  )

  return <TransfersContext.Provider value={value}>{children}</TransfersContext.Provider>
}

export function useTransfersStore() {
  const ctx = useContext(TransfersContext)
  if (!ctx) {
    throw new Error("useTransfersStore must be used within TransfersProvider")
  }
  return ctx
}
