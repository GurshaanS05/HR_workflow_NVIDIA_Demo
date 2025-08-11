import type { Status, Transfer } from "./types"

export function getStatusStakeholders(t: Transfer, status: Status) {
  let want: ("owningHRBP" | "globalHRBP" | "compPartner" | "mobilityPartner")[] = []
  if (status === "1. Initiated") want = ["owningHRBP", "globalHRBP"]
  if (status === "3. Logistics Check") want = ["compPartner", "mobilityPartner"]
  if (status === "5. Awaiting Letter") want = ["mobilityPartner"]

  const map: Record<string, string | undefined> = {
    owningHRBP: t.owningHRBP,
    globalHRBP: t.globalHRBP,
    compPartner: t.compPartner,
    mobilityPartner: t.mobilityPartner,
  }

  const recipients = want
    .map((k) => map[k])
    .filter((v): v is string => !!v)
  const missing = want.filter((k) => !map[k]).map((k) => k.replace(/([A-Z])/g, " $1"))
  return { recipients, missing }
}

export function getApprovalStakeholders(t: Transfer) {
  const emails = [t.managerEmail, t.org3Lead, t.globalHRBP].filter((x): x is string => !!x)
  return emails
}
