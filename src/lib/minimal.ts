// What the minimal version shows, derived from the shared synthetic data.
import { AGENTS, type Agent } from "@/lib/moneiva/agents-data"
import { AUTOMATIONS } from "@/lib/moneiva/automations-data"
import { REQUEST_TYPES, STAGES, type Stage } from "@/lib/moneiva/data"
import { inboxItems, type CallItem, type NewTypeItem, type ReplyItem } from "@/lib/moneiva/inbox-data"
import { THREADS, type Thread } from "@/lib/moneiva/training-data"

export const TODAY = "Monday, October 13"

/** Review: only decisions about real work (replies to approve, calls to return). */
export const REVIEW_ITEMS = inboxItems.filter((i): i is ReplyItem | CallItem => i.kind === "reply" || i.kind === "call")
export const REVIEW_COUNT = REVIEW_ITEMS.length

/** Teach: everything that makes the agents smarter, in one queue. */
export type TeachItem = { kind: "thread"; thread: Thread } | { kind: "new"; item: NewTypeItem }
export const TEACH_ITEMS: TeachItem[] = [
  ...inboxItems.filter((i): i is NewTypeItem => i.kind === "new").map((item) => ({ kind: "new" as const, item })),
  ...THREADS.filter((t) => t.group === "check").map((thread) => ({ kind: "thread" as const, thread })),
]

export const STAGE_INFO: Record<Stage, { label: string; sub: string }> = {
  Learn: { label: "Learning", sub: "Reading past email. Nothing is sent." },
  Shadow: { label: "Shadowing", sub: "Watching live email and guessing what your team will do. Nothing is sent." },
  Review: { label: "Reviewing", sub: "Writes every reply. A person approves it before it goes out." },
  Autopilot: { label: "Autopilot", sub: "Handles it on its own. You can still see everything in Activity." },
}

export const stageCounts = () => STAGES.map((s) => ({ stage: s, count: REQUEST_TYPES.filter((t) => t.stage === s).length }))

/** One stage per agent, for the four step journey. The Operator is per request type. */
export const AGENT_STAGE: Record<Agent["id"], Stage> = { op: "Shadow", phone: "Review", check: "Autopilot", osd: "Review", cat: "Learn" }

export const TOTALS = {
  emails: 25,
  calls: AGENTS.filter((a) => a.kind === "inbound" || a.kind === "outbound").reduce((n, a) => n + Number(a.today), 0),
  onTheirOwn: "86%",
}

export function agentState(a: Agent): { tone: "ok" | "warn" | "bad" | "off"; label: string } {
  if (a.status === "error") return { tone: "bad", label: "Stopped" }
  if (a.status === "off" || a.status === "paused") return { tone: "off", label: "Off" }
  if (a.id === "op" || a.id === "phone") return { tone: "warn", label: "Needs you" }
  return { tone: "ok", label: "Running" }
}

/** Workflows in plain words: when this happens, do that. */
export type WorkflowStep = { title: string; sub: string; agent?: string }
export type Workflow = (typeof AUTOMATIONS)[number] & { sentence: string; steps: WorkflowStep[] }

const STEPS: Record<string, WorkflowStep[]> = {
  osd: [
    { title: "A damage report arrives", sub: "New email with an overage, shortage or damage report" },
    { title: "Read the report", sub: "Finds the PRO, the delivery site and what was reported", agent: "The Operator" },
    { title: "Call the delivery site", sub: "Confirms pieces, condition and photos", agent: "OS&D check calls" },
    { title: "If a problem is confirmed, claims approves", sub: "Waits in Review for the claims team" },
    { title: "Email claims and the customer", sub: "Claim number, call summary and photos" },
  ],
  late: [
    { title: "Weekdays at 9 AM and 2 PM", sub: "Every load in Acme that is running late" },
    { title: "Call the carrier", sub: "Asks for a new ETA and the reason", agent: "Carrier check calls" },
    { title: "Email the customer", sub: "Shares the new ETA", agent: "The Operator" },
  ],
  missed: [
    { title: "A voicemail is left after hours", sub: "On (555) 010-0345" },
    { title: "Turn the voicemail into a summary", sub: "Who called and what they need", agent: "Inbound phone line" },
    { title: "Email the caller back", sub: "Says the desk will follow up in the morning", agent: "The Operator" },
  ],
  latepickup: [
    { title: "A pickup is 2 hours late", sub: "Checked in Acme every 15 minutes" },
    { title: "Email the dispatcher", sub: "dispatch@example.test, with the pickup and the customer" },
  ],
  kpi: [
    { title: "Mondays at 7 AM", sub: "Last week's numbers" },
    { title: "Email the team leads", sub: "Emails handled, calls answered, time saved" },
  ],
  dedup: [
    { title: "New email to service@example.test", sub: "" },
    { title: "Merge repeat emails", sub: "Before the Operator reads them", agent: "The Operator" },
  ],
  holiday: [
    { title: "Dec 24 to Jan 2", sub: "" },
    { title: "Reply that the desk is closed", sub: "Sends the reopening date" },
  ],
}

const SENTENCE: Record<string, string> = {
  osd: "When a damage report comes in, confirm it with the delivery site and tell claims or the customer.",
  late: "Twice a day, get a new ETA for late loads and email the customer.",
  missed: "When someone leaves a voicemail after hours, email them back.",
  latepickup: "When a pickup is 2 hours late, email the dispatcher.",
  kpi: "Every Monday, email last week's numbers to the team leads.",
  dedup: "Merge repeat emails before the Operator reads them.",
  holiday: "Over the holidays, tell senders the desk is closed.",
}

export const WORKFLOWS: Workflow[] = AUTOMATIONS.map((w) => ({
  ...w,
  steps: STEPS[w.id] ?? [],
  sentence: SENTENCE[w.id] ?? w.desc,
}))

export const workflowById = (id: string) => WORKFLOWS.find((w) => w.id === id)
