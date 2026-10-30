// Inbox items. The Inbox section owns this file; keep exporting `inboxItems`.
// Everything here is synthetic (example.test addresses, Acme Logistics, Contoso Retail, Fabrikam Foods, Northwind).
import type { Stage } from "@/lib/moneiva/data"

export type InboxKind = "reply" | "call" | "new"

export type InboxEmail = {
  who: string
  addr: string
  to: string
  time: string
  subject?: string
  body: string
  file?: string
  /** A message from your own side (the phone line), shown with a "Your team" badge. */
  team?: boolean
}

export type InboxCheck = { title: string; detail: string }

type Base = {
  id: string
  /** Short title, used by the sidebar and for the item heading. */
  title: string
  kind: InboxKind
  /** One line summary shown in the list. */
  line: string
  emails: InboxEmail[]
}

export type ReplyItem = Base & {
  kind: "reply"
  from: string
  company: string
  addr: string
  subject: string
  when: string
  wait: string
  type: string | null
  guess?: string
  asked: string
  reply: string
  edited: string
  also?: string
  why: string
  ruleUsed?: string
  instead: string
  ruleType: string
  ruleWhen: string
  ruleThen: string
  checks: InboxCheck[]
}

export type CallItem = Base & {
  kind: "call"
  from: string
  company: string
  addr: string
  subject: string
  when: string
  wait: string
  type: string | null
  guess?: string
  agent: string
  asked: string
  stepTitle: string
  step: string
  ruleType: string
  ruleWhen: string
  ruleThen: string
  checks: InboxCheck[]
}

export type NewTypeItem = Base & {
  kind: "new"
  name: string
  found: string
  desc: string
  would: string
  similar?: string
}

export type InboxItem = ReplyItem | CallItem | NewTypeItem

/** The request types offered in the Inbox "Choose" menu, grouped by stage. */
export const INBOX_TYPES: { stage: Stage; name: string }[] = [
  { stage: "Review", name: "ETA or status request" },
  { stage: "Review", name: "Proof of delivery request" },
  { stage: "Review", name: "Hold at terminal request" },
  { stage: "Shadow", name: "Billing or rate dispute" },
  { stage: "Shadow", name: "Confirmation on a pickup" },
  { stage: "Shadow", name: "Missed pickup recovery" },
  { stage: "Shadow", name: "PRO tracking request" },
  { stage: "Learn", name: "Pickup status without a reference" },
  { stage: "Learn", name: "Freight charges inquiry by PRO" },
]

export function stageOfType(name: string): Stage {
  return INBOX_TYPES.find((t) => t.name === name)?.stage ?? "Shadow"
}

export const DONT_SEND_REASONS = [
  "The information is wrong",
  "It's the wrong request type",
  "No reply is needed",
  "Someone already handled it",
  "Other",
] as const

export const inboxItems: InboxItem[] = [
  {
    id: "r1",
    kind: "reply",
    title: "Pricing on our last shipment",
    from: "Alex Rivera",
    company: "Northwind Supply",
    addr: "alex@example.test",
    subject: "Pricing on our last shipment",
    when: "Oct 8, 9:05 AM",
    wait: "5 days",
    line: "Forward to billing: charge question on PRO 0300100123",
    type: null,
    guess: "Billing or rate dispute",
    asked: "Why the invoice for PRO 0300100123 is higher than the quote they got.",
    reply:
      "Hi Alex,\n\nThanks for reaching out. We've passed your question about PRO 0300100123 to our billing team, and they will reply to you directly with a breakdown of the charges.\n\nThank you,\nCustomer Service Team",
    edited:
      "Hi Alex,\n\nThanks for reaching out. We've passed your question about PRO 0300100123 to our billing team. They usually reply within one business day with a full breakdown of the charges.\n\nThank you,\nCustomer Service Team",
    also: "Forward the email to billing@example.test with the PRO and the quote attached.",
    why: "The email asks about charges on an invoice. Your team never quotes or explains rates by email, so the Operator hands it to billing and lets Alex know.",
    ruleUsed: "Never quote a rate. Forward the email to billing.",
    instead: "Call Alex first. The extra charge is a liftgate fee and it is quick to explain.",
    ruleType: "Billing or rate dispute",
    ruleWhen: "the email asks why an invoice is higher than the quote",
    ruleThen: "forward it to billing and let the customer know billing will reply",
    emails: [
      {
        who: "Alex Rivera",
        addr: "alex@example.test",
        to: "service@example.test",
        time: "Oct 8, 9:05 AM",
        subject: "Pricing on our last shipment",
        body: "Hello,\nWe were quoted $412 for PRO 0300100123, but the invoice says $538. Can you tell us what the difference is for?\nThanks,\nAlex Rivera\nNorthwind Supply",
        file: "Invoice 55120.pdf",
      },
    ],
    checks: [
      { title: "Read the email and the attached invoice", detail: "Found PRO 0300100123 and an invoice total of $538." },
      { title: "Looked up PRO 0300100123 in Acme", detail: "Delivered Oct 6. The invoice has a liftgate charge that was not on the quote." },
      { title: "Could not match a request type", detail: "Closest is Billing or rate dispute, but the Operator is not sure, so it asked a person." },
      { title: "Applied a rule", detail: "Never quote a rate. Forward the email to billing." },
    ],
  },
  {
    id: "r2",
    kind: "reply",
    title: "Pickup yesterday",
    from: "Alex Rivera",
    company: "Northwind Supply",
    addr: "alex@example.test",
    subject: "Pickup yesterday",
    when: "Oct 9, 8:20 AM",
    wait: "4 days",
    line: "Ask for the pickup number or a reference",
    type: null,
    guess: "Pickup status without a reference (new)",
    asked: "The status of a pickup from yesterday. There is no pickup number or reference in the email.",
    reply:
      "Hi Alex,\n\nThanks for reaching out. To look up your pickup from yesterday (10/08/2026), we need a reference to search with. Please reply with the Acme pickup number, or a PRO, BOL, PO or load number, and we'll send its current status.\n\nThank you,\nCustomer Service Team",
    edited:
      "Hi Alex,\n\nThanks for reaching out. We found two pickups for Northwind Supply yesterday (10/08/2026): 9900451 from Dallas and 9900452 from Houston. Which one are you asking about? We'll send its status right away.\n\nThank you,\nCustomer Service Team",
    why: "The email doesn't include a pickup number or reference, so the Operator couldn't tell which pickup Alex means. It asks for one instead of guessing.",
    instead: "Look up pickups for Northwind Supply from that day. There are only two, so ask which one instead of asking for a number.",
    ruleType: "Pickup status without a reference",
    ruleWhen: "the customer has 3 or fewer pickups on the date they mention",
    ruleThen: "list those pickups and ask which one they mean",
    emails: [
      {
        who: "Alex Rivera",
        addr: "alex@example.test",
        to: "service@example.test",
        time: "Oct 9, 8:20 AM",
        subject: "Pickup yesterday",
        body: "Hi, can you tell me the status of my pickup from yesterday?\nThanks,\nAlex",
      },
    ],
    checks: [
      { title: "Looked for a reference in the email", detail: "No pickup number, PRO, BOL, PO or load number." },
      {
        title: "Searched Acme for pickups from Northwind Supply on Oct 8",
        detail: "Found 2: 9900451 (Dallas) and 9900452 (Houston). It can't tell which one Alex means.",
      },
      { title: "Could not match a request type", detail: "It looks like a new kind of email. The Operator also listed it under New request types." },
    ],
  },
  {
    id: "r3",
    kind: "reply",
    title: "pickup 9900456",
    from: "Riley Chen",
    company: "Contoso Retail",
    addr: "riley@example.test",
    subject: "pickup 9900456",
    when: "Oct 9, 10:12 AM",
    wait: "4 days",
    line: "Reply with the pickup status from Acme",
    type: "ETA or status request",
    asked: "Whether pickup 9900456 was picked up, and when it will deliver.",
    reply:
      "Hi Riley,\n\nPickup 9900456 was picked up on Oct 8 at 2:15 PM. Its PRO number is 0300100456, and it is scheduled to deliver to Contoso Retail in Memphis on Oct 10.\n\nThank you,\nCustomer Service Team",
    edited:
      "Hi Riley,\n\nPickup 9900456 was picked up on Oct 8 at 2:15 PM. Its PRO number is 0300100456, and it is scheduled to deliver to Contoso Retail in Memphis on Oct 10 between 8 AM and noon.\n\nThank you,\nCustomer Service Team",
    why: "Riley gave a pickup number. The Operator found it in Acme and replied with the status, the PRO and the delivery date, the way your team answers these.",
    ruleUsed: "If the pickup date is more than 90 days ago, don't reply with the status. Escalate. (Checked: it was 1 day ago.)",
    instead: "Riley is on the Contoso account team. Send the update to the shared Contoso inbox too.",
    ruleType: "ETA or status request",
    ruleWhen: "the sender is from Contoso Retail",
    ruleThen: "copy logistics@contoso.example.test on the reply",
    emails: [
      {
        who: "Riley Chen",
        addr: "riley@example.test",
        to: "service@example.test",
        time: "Oct 9, 10:12 AM",
        subject: "pickup 9900456",
        body: "Good morning,\nCan you confirm pickup 9900456 went out yesterday and when it will deliver?\nRiley Chen\nContoso Retail",
      },
    ],
    checks: [
      { title: "Found pickup 9900456 in Acme", detail: "Picked up Oct 8, 2:15 PM, from the Dallas dock." },
      { title: "Found the PRO number", detail: "0300100456, scheduled to deliver Oct 10." },
      { title: "Checked the rules for ETA or status request", detail: "Pickup is 1 day old, not 90. No rule stops the reply." },
    ],
  },
  {
    id: "r4",
    kind: "reply",
    title: "Driver on time for pickup 9800123?",
    from: "Sam Patel",
    company: "Fabrikam Foods",
    addr: "sam@example.test",
    subject: "Driver on time for pickup 9800123?",
    when: "Oct 9, 11:02 AM",
    wait: "4 days",
    line: "Reply with the status of pickup 9800123",
    type: "ETA or status request",
    asked: "Whether the driver will make pickup 9800123 before the dock closes at 3 PM. This is Sam's second email.",
    reply:
      "Hi Sam,\n\nThe driver for pickup 9800123 is on the way and expected between 1 and 2 PM today, before your dock closes at 3 PM.\n\nThank you,\nCustomer Service Team",
    edited:
      "Hi Sam,\n\nSorry for the slow reply. The driver for pickup 9800123 is on the way and expected between 1 and 2 PM today, before your dock closes at 3 PM. We'll let you know right away if that changes.\n\nThank you,\nCustomer Service Team",
    why: "Acme shows the driver finishing deliveries first, with the pickup expected by 2 PM. The dock closes in 4 hours, so the rule for pickups closing within an hour did not apply.",
    ruleUsed: "If the pickup is for today and closes within an hour, don't reply. Escalate. (Checked: closes in 4 hours.)",
    instead: "Call Sam. This is the second email and the pickup is today.",
    ruleType: "ETA or status request",
    ruleWhen: "the customer has already followed up once",
    ruleThen: "open the reply with an apology for the wait",
    emails: [
      {
        who: "Sam Patel",
        addr: "sam@example.test",
        to: "service@example.test",
        time: "Oct 9, 7:48 AM",
        subject: "Driver on time for pickup 9800123?",
        body: "Hi,\nWill the driver be on time for pickup 9800123 today? Our dock closes at 3 PM.\nSam Patel\nFabrikam Foods",
      },
      {
        who: "Sam Patel",
        addr: "sam@example.test",
        to: "service@example.test",
        time: "Oct 9, 11:02 AM",
        subject: "RE: Driver on time for pickup 9800123?",
        body: "Following up on this. Please let me know.\nSam",
      },
    ],
    checks: [
      { title: "Found pickup 9800123 in Acme", detail: "Scheduled for today. The driver is on route." },
      { title: "Checked the driver's route", detail: "Deliveries first, then pickups. Expected at Fabrikam between 1 and 2 PM." },
      { title: "Checked the rules for ETA or status request", detail: "Dock closes in 4 hours, not within an hour. No rule stops the reply." },
    ],
  },
  {
    id: "c1",
    kind: "call",
    title: "Reschedule pickup 9800777",
    from: "Casey Nguyen",
    company: "Contoso Retail",
    addr: "(555) 010-0142",
    subject: "Reschedule pickup 9800777",
    when: "Oct 12, 3:40 PM",
    wait: "1 day",
    line: "Call back to move the pickup to Friday",
    type: "Confirmation on a pickup",
    agent: "Inbound phone line",
    asked:
      "Casey wants to move pickup 9800777 from Thursday to Friday morning. The phone line can't change pickups, so it told Casey someone would call back.",
    stepTitle: "Call Casey back at (555) 010-0142",
    step: "Move pickup 9800777 to Friday, 8 to 11 AM, then confirm the new window on the call.",
    ruleType: "Confirmation on a pickup",
    ruleWhen: "a caller asks to move a pickup to another day",
    ruleThen: "text them that someone will call back today, and put the call at the top of Inbox",
    emails: [
      { who: "Phone line", addr: "Inbound phone line", to: "Casey Nguyen", time: "0:00", body: "Acme Logistics, how can I help?", team: true },
      { who: "Casey Nguyen", addr: "(555) 010-0142", to: "Phone line", time: "0:04", body: "I need to move pickup 9800777 to Friday morning." },
      {
        who: "Phone line",
        addr: "Inbound phone line",
        to: "Casey Nguyen",
        time: "0:12",
        body: "I can't change pickups myself, but I'll have someone call you back today to move it.",
        team: true,
      },
    ],
    checks: [
      { title: "Took the call", detail: "Oct 12, 3:40 PM. 1 minute 18 seconds." },
      { title: "Found pickup 9800777 in Acme", detail: "Scheduled for Thursday, Oct 16." },
      { title: "Could not change the pickup", detail: "The phone line is not allowed to move pickups, so it promised a call back." },
    ],
  },
  {
    id: "n1",
    kind: "new",
    title: "Pickup status without a reference",
    name: "Pickup status without a reference",
    line: 'Seen in 6 emails, like "Pickup yesterday"',
    found: "6 emails in the last two weeks asked about a pickup without giving a pickup number or any other reference.",
    desc: "A customer asks for the status of a pickup but gives no pickup number, PRO, BOL, PO or load number.",
    would: "Ask for a reference, or list the customer's pickups from that day and ask which one they mean.",
    emails: [
      {
        who: "Alex Rivera",
        addr: "alex@example.test",
        to: "service@example.test",
        time: "Oct 9",
        subject: "Pickup yesterday",
        body: "Hi, can you tell me the status of my pickup from yesterday?\nThanks,\nAlex",
      },
      {
        who: "Jamie Brooks",
        addr: "jamie@example.test",
        to: "service@example.test",
        time: "Oct 6",
        subject: "Where is our pickup",
        body: "Our freight was supposed to go out this morning. Has anyone come by yet?",
      },
      {
        who: "Morgan Diaz",
        addr: "morgan@example.test",
        to: "service@example.test",
        time: "Oct 2",
        subject: "Status?",
        body: "Can I get a status on the pickup from our Houston location today?",
      },
    ],
  },
  {
    id: "n2",
    kind: "new",
    title: "Freight charges inquiry by PRO",
    name: "Freight charges inquiry by PRO",
    line: 'Seen in 4 emails, like "Pricing on our last shipment"',
    found: "4 emails asked why the charges on a PRO were different from what the customer expected.",
    desc: "A customer gives a PRO number and asks about the charges on it, usually because the invoice is higher than the quote.",
    would: "Forward the email to billing with the PRO, and tell the customer billing will reply.",
    emails: [
      {
        who: "Alex Rivera",
        addr: "alex@example.test",
        to: "service@example.test",
        time: "Oct 8",
        subject: "Pricing on our last shipment",
        body: "We were quoted $412 for PRO 0300100123, but the invoice says $538. Can you tell us what the difference is for?",
      },
      {
        who: "Riley Chen",
        addr: "riley@example.test",
        to: "service@example.test",
        time: "Oct 3",
        subject: "PRO 0300100345 charges",
        body: "Why is there a residential fee on PRO 0300100345? This was a business address.",
      },
    ],
  },
  {
    id: "n3",
    kind: "new",
    title: "Freight charges on an existing shipment",
    name: "Freight charges on an existing shipment",
    line: 'Seen in 3 emails, like "PRO 0300100123 Freight Charges"',
    found: "3 emails asked about extra charges on a shipment that already delivered.",
    desc: "A customer asks about added fees, such as liftgate or reweigh, on a shipment that has already delivered.",
    would: "Forward the email to billing with the PRO and the invoice.",
    similar: "Freight charges inquiry by PRO",
    emails: [
      {
        who: "Alex Rivera",
        addr: "alex@example.test",
        to: "service@example.test",
        time: "Oct 7",
        subject: "PRO 0300100123 Freight Charges",
        body: "There is a liftgate charge on PRO 0300100123. We didn't ask for a liftgate. Please remove it.",
      },
      {
        who: "Sam Patel",
        addr: "sam@example.test",
        to: "service@example.test",
        time: "Oct 1",
        subject: "Reweigh fee",
        body: "We were charged a reweigh fee on PRO 0300100888. Can you send the reweigh ticket?",
      },
    ],
  },
]

export function inboxItemById(id: string | undefined | null): InboxItem | undefined {
  return inboxItems.find((i) => i.id === id)
}
