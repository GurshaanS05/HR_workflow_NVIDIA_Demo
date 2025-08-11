export type Status =
  | "1. Initiated"
  | "2. Package Prep"
  | "3. Logistics Check"
  | "4. Awaiting Approvals"
  | "5. Awaiting Letter"
  | "6. Closed"

export type ActivityItem = { ts: string; actor: string; action: string; notes?: string }

export type Transfer = {
  id: string
  employeeName: string
  employeeEmail?: string
  currentLocation?: string
  targetLocation?: string
  managerName: string
  managerEmail?: string
  owningHRBP: string
  globalHRBP?: string
  org3Lead?: string
  compPartner?: string
  mobilityPartner?: string
  businessJustification?: string
  proposedSalaryChange?: string
  relocationCostEstimate?: string
  createdAt: string // ISO
  updatedAt: string // ISO
  status: Status
  activity: ActivityItem[]
}

export type Templates = {
  statusChanged: string
  requestApprovals: string
}
