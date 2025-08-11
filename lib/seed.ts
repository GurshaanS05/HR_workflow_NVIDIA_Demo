import type { Transfer, Status } from "./types"

const names = [
  ["Alice Johnson", "alice.johnson@example.com"],
  ["Brian Lee", "brian.lee@example.com"],
  ["Carla Gomez", "carla.gomez@example.com"],
  ["Daniel Wu", "daniel.wu@example.com"],
  ["Elena Petrova", "elena.petrova@example.com"],
  ["Farah Khan", "farah.khan@example.com"],
  ["George Smith", "george.smith@example.com"],
  ["Hannah Kim", "hannah.kim@example.com"],
  ["Ivan Novak", "ivan.novak@example.com"],
  ["Julia Rossi", "julia.rossi@example.com"],
  ["Kevin Brown", "kevin.brown@example.com"],
  ["Lina Chen", "lina.chen@example.com"],
]

const hrbps = ["Emma Davis", "Oliver Scott", "Sophia Turner"]
const managers = [
  ["Michael Park", "michael.park@company.com"],
  ["Nina Alvarez", "nina.alvarez@company.com"],
  ["Owen Carter", "owen.carter@company.com"],
]
const partners = {
  comp: ["comp.amy@company.com", "comp.luke@company.com"],
  mobility: ["mobility.sara@company.com", "mobility.john@company.com"],
}
const locations = ["NYC, USA", "Dublin, IE", "Berlin, DE", "Toronto, CA", "Singapore, SG", "Sydney, AU"]

const statuses: Status[] = [
  "1. Initiated",
  "2. Package Prep",
  "3. Logistics Check",
  "4. Awaiting Approvals",
  "5. Awaiting Letter",
  "6. Closed",
]

export function seedTransfers(count = 12): Transfer[] {
  const out: Transfer[] = []
  for (let i = 0; i < count; i++) {
    const [employeeName, employeeEmail] = names[i % names.length]
    const [managerName, managerEmail] = managers[i % managers.length]
    const owningHRBP = hrbps[i % hrbps.length]
    const globalHRBP = hrbps[(i + 1) % hrbps.length] + " (Global)"
    const compPartner = partners.comp[i % partners.comp.length]
    const mobilityPartner = partners.mobility[i % partners.mobility.length]
    const currentLocation = locations[(i + 2) % locations.length]
    const targetLocation = locations[(i + 5) % locations.length]
    const createdAt = new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString()
    const status = statuses[i % statuses.length]
    const updatedAt = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()

    out.push({
      id: crypto.randomUUID(),
      employeeName,
      employeeEmail,
      currentLocation,
      targetLocation,
      managerName,
      managerEmail,
      owningHRBP,
      globalHRBP,
      org3Lead: ["Priya Singh", "Tom Müller", "Isabelle Dupont"][i % 3],
      compPartner,
      mobilityPartner,
      businessJustification:
        "Critical skills needed in target market. Aligns with growth plan for regional launch. Expect uplift in productivity.",
      proposedSalaryChange: i % 2 === 0 ? "+8%" : "",
      relocationCostEstimate: i % 3 === 0 ? "$15,000" : "",
      createdAt,
      updatedAt,
      status,
      activity: [
        { ts: createdAt, actor: "System", action: "Created transfer" },
        ...(status !== "1. Initiated"
          ? [{ ts: updatedAt, actor: "System", action: `Status changed to ${status}` }]
          : []),
      ],
    })
  }
  return out
}
