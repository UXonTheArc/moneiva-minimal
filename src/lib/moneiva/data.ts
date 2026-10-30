// Shared mockup data. Everything here is synthetic (example.test addresses, (555) 010 numbers).

export const STAGES = ["Learn", "Shadow", "Review", "Autopilot"] as const
export type Stage = (typeof STAGES)[number]

export type AgentStatus = "live" | "test" | "paused" | "off" | "error" | "archived"

export const ORG = { name: "Acme Logistics", initials: "AL" }
export const ME = { name: "Taylor Morgan", email: "taylor@example.test", initials: "TM" }

/**
 * Request types and where each one is on the Operator's journey.
 * Learn: line = an example email subject.
 * Shadow: matched of predictions matched your team.
 * Review: matched of replies approved as written.
 */
export type RequestType = { name: string; stage: Stage; matched: number; of: number; line: string; flag: "" | "name" | "ready" }
export const REQUEST_TYPES: RequestType[] = [
  { name: "Pickup status without a reference", stage: "Learn", matched: 0, of: 0, line: "Pickup yesterday", flag: "name" },
  { name: "Freight charges inquiry by PRO", stage: "Learn", matched: 0, of: 0, line: "Pricing on our last shipment", flag: "name" },
  { name: "Freight charges on an existing shipment", stage: "Learn", matched: 0, of: 0, line: "PRO 0300100123 Freight Charges", flag: "name" },
  { name: "PRO tracking request", stage: "Shadow", matched: 6, of: 6, line: "Matched your team every time", flag: "ready" },
  { name: "Confirmation on a pickup", stage: "Shadow", matched: 2, of: 2, line: "Needs more emails before it can move", flag: "" },
  { name: "Billing or rate dispute", stage: "Shadow", matched: 2, of: 2, line: "Needs more emails before it can move", flag: "" },
  { name: "Delivery bounce notice", stage: "Shadow", matched: 0, of: 5, line: "Recognized 5, predicted nothing yet", flag: "" },
  { name: "Missed pickup recovery", stage: "Shadow", matched: 3, of: 5, line: "Needs more emails before it can move", flag: "" },
  { name: "New pickup request", stage: "Shadow", matched: 4, of: 6, line: "Needs more emails before it can move", flag: "" },
  { name: "Reconsignment request", stage: "Shadow", matched: 1, of: 2, line: "Needs more emails before it can move", flag: "" },
  { name: "Document request or correction", stage: "Shadow", matched: 2, of: 4, line: "Needs more emails before it can move", flag: "" },
  { name: "Delivery appointment", stage: "Shadow", matched: 3, of: 4, line: "Needs more emails before it can move", flag: "" },
  { name: "Pickup change request", stage: "Shadow", matched: 1, of: 3, line: "Needs more emails before it can move", flag: "" },
  { name: "Address correction", stage: "Shadow", matched: 0, of: 1, line: "Needs more emails before it can move", flag: "" },
  { name: "ETA or status request", stage: "Review", matched: 16, of: 34, line: "9 rejected \u00b7 8 couldn't finish", flag: "" },
  { name: "Proof of delivery request", stage: "Review", matched: 0, of: 1, line: "1 waiting for approval", flag: "" },
  { name: "Auto-reply or out of office", stage: "Review", matched: 0, of: 0, line: "No emails this period", flag: "" },
  { name: "Hold at terminal request", stage: "Review", matched: 1, of: 1, line: "Approved as written", flag: "" },
  { name: "Weight or class inspection", stage: "Review", matched: 0, of: 1, line: "1 rejected", flag: "" }
]

export type Rule = { text: string; requestType: string; source: string; by: string; on: string; active: boolean }
export const RULES: Rule[] = [
  { text: "If the pickup date is more than 90 days ago, don't reply with the status. Escalate.", requestType: "ETA or status request", source: "From a correction in Inbox", by: "Jordan Lee", on: "Sep 29", active: true },
  { text: "If the Acme lookup shows pickup facility 992, don't reply. Escalate.", requestType: "ETA or status request", source: "Added by hand", by: "Jordan Lee", on: "Sep 29", active: true },
  { text: "If the pickup is for today and closes within an hour, don't reply. Escalate.", requestType: "ETA or status request", source: "From a correction in Inbox", by: "Taylor Morgan", on: "Sep 24", active: true },
  { text: "Only send a proof of delivery to an email address on the account.", requestType: "Proof of delivery request", source: "Added by hand", by: "Taylor Morgan", on: "Sep 22", active: true },
  { text: "Never quote a rate. Forward the email to billing.", requestType: "Billing or rate dispute", source: "Added by hand", by: "Jordan Lee", on: "Sep 20", active: true },
  { text: "If the PRO doesn't pull up, say the freight hasn't been picked up yet and share the pickup number.", requestType: "PRO tracking request", source: "From a correction in Inbox", by: "Jordan Lee", on: "Sep 18", active: true },
  { text: "Don't reply to auto-replies or out of office messages.", requestType: "Auto-reply or out of office", source: "Added by hand", by: "Taylor Morgan", on: "Sep 16", active: true },
  { text: "Sign every reply \"Customer Service Team\".", requestType: "All request types", source: "Added by hand", by: "Taylor Morgan", on: "Sep 16", active: false }
]

export type Doc = { name: string; kind: string; facts: string; by: string; on: string; state: string }
export const DOCS: Doc[] = [
  { name: "Northwind routing guide.pdf", kind: "PDF", facts: "9 facts", by: "Taylor Morgan", on: "Sep 16", state: "Read" },
  { name: "Acme rate and accessorial sheet.pdf", kind: "PDF", facts: "5 facts", by: "Jordan Lee", on: "Sep 16", state: "Read" },
  { name: "Dock hours and addresses.xlsx", kind: "Spreadsheet", facts: "26 facts", by: "Jordan Lee", on: "Sep 18", state: "Read" },
  { name: "Customer service handbook.docx", kind: "Word document", facts: "Not finished", by: "Taylor Morgan", on: "Oct 9", state: "Reading" }
]
