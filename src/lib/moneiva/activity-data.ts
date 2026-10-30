// Activity: every email, text and call the agents handled. Synthetic data only.
import type { Stage } from "./data"

export type ActivityChannel = "Email" | "Inbound call" | "Outbound call" | "Text message"
export type ActivityStatus = "needs" | "prog" | "done" | "fail" | "ign"
export type ActivityLine = { who: string; text: string }
export type ActivityMsg = { who: string; addr: string; time: string; body: string; draft?: boolean }
export type ActivityStep = { title: string; sub: string; mark?: "ok" | "bad" | "wait" }

export type ActivityRow = {
  id: string
  agent: string
  when: string
  channel: ActivityChannel
  from: string
  customer: string
  about: string
  type: string
  stage: Stage
  status: ActivityStatus
  note?: string
  ref: string
  by: string
  statusNote: string
  length?: string
  ask?: string
  cta?: string
  asked: string
  did: string
  lines?: ActivityLine[]
  msgs?: ActivityMsg[]
  steps: ActivityStep[]
}

export const STATUS_LABEL: Record<ActivityStatus, string> = {
  needs: "Needs you",
  prog: "In progress",
  done: "Done",
  fail: "Couldn't finish",
  ign: "Ignored",
}

export const STATUS_DOT: Record<ActivityStatus, string> = {
  needs: "bg-amber-600",
  prog: "bg-sky-600",
  done: "bg-green-600",
  fail: "bg-red-600",
  ign: "bg-zinc-400",
}

export type FilterKey = "agent" | "channel" | "status" | "type"
export const FILTER_MENUS: { key: FilterKey; title: string; opts: string[] }[] = [
  { key: "agent", title: "Agent", opts: ["The Operator", "Inbound phone line", "Carrier check calls"] },
  { key: "channel", title: "Channel", opts: ["Email", "Inbound call", "Outbound call", "Text message"] },
  { key: "status", title: "Status", opts: ["needs", "prog", "done", "fail", "ign"] },
  {
    key: "type",
    title: "Request type",
    opts: [
      "New request type",
      "Confirmation on a pickup",
      "PRO tracking request",
      "ETA or status request",
      "Proof of delivery request",
      "Auto-reply or out of office",
    ],
  },
]

/** Where each row's call to action goes in Inbox. */
export const INBOX_LINK: Record<string, string> = {
  r0: "/inbox?filter=call&item=c1",
  r1: "/inbox?item=r4",
  r3: "/inbox?item=r2",
  r4: "/inbox?item=r1",
  r6: "/inbox?item=r3",
  r8: "/inbox",
}

export const ACTIVITY: ActivityRow[] = [
  { id: 'r0', agent: 'Inbound phone line', when: 'Oct 12, 3:40 PM', channel: 'Inbound call', from: 'Casey Nguyen', customer: 'Casey Nguyen, Contoso Retail',
    about: 'Reschedule pickup 9800777', type: 'Confirmation on a pickup', stage: 'Shadow', status: 'needs',
    ref: 'Pickup 9800777', by: 'Inbound phone line, waiting for a person', statusNote: 'Call to return', length: '1:18',
    ask: 'Call Casey back and move the pickup to Friday morning. The phone line can\'t change pickups.', cta: 'Open in Inbox',
    asked: 'To move pickup 9800777 from Thursday to Friday morning.',
    did: 'Took the request and told Casey someone would call back today.',
    lines: [
      { who: 'Phone line', text: 'Acme Logistics, how can I help?' },
      { who: 'Casey Nguyen', text: 'I need to move pickup 9800777 to Friday morning.' },
      { who: 'Phone line', text: 'I can\'t change pickups myself, but I\'ll have someone call you back today to move it.' },
      { who: 'Casey Nguyen', text: 'Okay, thanks.' }
    ],
    steps: [
      { title: 'Call answered', sub: 'Inbound phone line · Oct 12, 3:40 PM' },
      { title: 'Recognized a pickup change', sub: 'The phone line cannot change pickups' },
      { title: 'Promised a call back', sub: 'Added to your Inbox' },
      { title: 'Waiting for someone to call back', sub: 'In your Inbox', mark: 'wait' }
    ] },
  { id: 'r1', agent: 'The Operator', when: 'Oct 9, 8:33 AM', channel: 'Email', from: 'Alex Rivera', customer: 'Alex Rivera, Northwind Traders',
    about: 'Driver on time for pickup 9800123?', type: 'ETA or status request', stage: 'Review', status: 'needs',
    ref: 'Pickup 9800123', by: 'Operator, waiting for approval', statusNote: 'Reply drafted, waiting for approval',
    ask: 'Approve the reply before it goes out. ETA or status requests are in Review, so every reply waits for a person.', cta: 'Review in Inbox',
    asked: 'Whether the driver will make today\'s pickup window for 9800123.',
    did: 'Looked up the pickup in dispatch, found it assigned to a driver for today, and drafted a reply confirming the window.',
    msgs: [
      { who: 'Alex Rivera', addr: 'alex@example.test', time: 'Oct 9, 8:33 AM', body: 'Hi,\nIs the driver still on time for pickup 9800123 today? Our dock closes at 4.\nThanks,\nAlex' },
      { who: 'The Operator', addr: 'To alex@example.test', time: 'Drafted 8:34 AM', draft: true, body: 'Hi Alex,\nYes, pickup 9800123 is assigned and scheduled for today between 1:00 and 3:00 PM, before your dock closes.\nThanks,\nAcme Logistics' }
    ],
    steps: [
      { title: 'Email received', sub: 'Gmail · Oct 9, 8:33 AM' },
      { title: 'Recognized as ETA or status request', sub: 'Matched a rule in the Playbook' },
      { title: 'Looked up pickup 9800123', sub: 'Dispatch · assigned for today' },
      { title: 'Drafted a reply', sub: 'Oct 9, 8:34 AM' },
      { title: 'Waiting for approval', sub: 'In your Inbox', mark: 'wait' }
    ] },
  { id: 'r2', agent: 'The Operator', when: 'Oct 9, 8:21 AM', channel: 'Email', from: 'Alex Rivera', customer: 'Alex Rivera, Northwind Traders',
    about: 'pickup 9900456', type: 'Confirmation on a pickup', stage: 'Shadow', status: 'prog',
    ref: 'Pickup 9900456', by: 'Your team', statusNote: 'Watching for your team\'s reply',
    ask: 'This request type is in Shadow, so the Operator sends nothing. It predicted a reply and will compare it with what your team sends.', cta: '',
    asked: 'Confirmation that pickup 9900456 is scheduled.',
    did: 'Predicted your team would confirm the pickup for Oct 10. Nothing was sent.',
    msgs: [
      { who: 'Alex Rivera', addr: 'alex@example.test', time: 'Oct 9, 8:21 AM', body: 'Can you confirm this got scheduled?\nAlex' }
    ],
    steps: [
      { title: 'Email received', sub: 'Gmail · Oct 9, 8:21 AM' },
      { title: 'Recognized as Confirmation on a pickup', sub: 'Shadow stage, nothing is sent' },
      { title: 'Predicted a reply', sub: 'Confirm the pickup for Oct 10' },
      { title: 'Watching for your team\'s reply', sub: 'Will compare once it is sent', mark: 'wait' }
    ] },
  { id: 'r3', agent: 'The Operator', when: 'Oct 9, 8:20 AM', channel: 'Email', from: 'Alex Rivera', customer: 'Alex Rivera, Northwind Traders',
    about: 'Pickup yesterday', type: 'New request type', stage: 'Learn', status: 'needs',
    ref: 'None found', by: 'Not handled yet', statusNote: 'New kind of request',
    ask: 'Name this request type. The Operator has not seen this kind of request before, so it is in Learn.', cta: 'Name it in Inbox',
    asked: 'Why yesterday\'s pickup did not happen. No pickup number was given.',
    did: 'Could not match it to a request type it knows. Nothing was sent.',
    msgs: [
      { who: 'Alex Rivera', addr: 'alex@example.test', time: 'Oct 9, 8:20 AM', body: 'Hi,\nWe had a pickup scheduled yesterday and nobody came. What happened?\nAlex' }
    ],
    steps: [
      { title: 'Email received', sub: 'Gmail · Oct 9, 8:20 AM' },
      { title: 'No matching request type', sub: 'Added to Learn as a new request type' },
      { title: 'Waiting for a name', sub: 'In your Inbox', mark: 'wait' }
    ] },
  { id: 'r4', agent: 'The Operator', when: 'Oct 8, 1:02 PM', channel: 'Email', from: 'Alex Rivera', customer: 'Alex Rivera, Northwind Traders',
    about: 'Pricing on our last shipment', type: 'New request type', stage: 'Learn', status: 'needs',
    ref: 'None found', by: 'Not handled yet', statusNote: 'New kind of request',
    ask: 'Name this request type. The Operator has not seen this kind of request before, so it is in Learn.', cta: 'Name it in Inbox',
    asked: 'The price charged on their most recent shipment.',
    did: 'Could not match it to a request type it knows. Nothing was sent.',
    msgs: [
      { who: 'Alex Rivera', addr: 'alex@example.test', time: 'Oct 8, 1:02 PM', body: 'Can you send over the pricing on our last shipment?\nAlex' }
    ],
    steps: [
      { title: 'Email received', sub: 'Gmail · Oct 8, 1:02 PM' },
      { title: 'No matching request type', sub: 'Added to Learn as a new request type' },
      { title: 'Waiting for a name', sub: 'In your Inbox', mark: 'wait' }
    ] },
  { id: 'r5', agent: 'The Operator', when: 'Oct 8, 1:01 PM', channel: 'Email', from: 'Alex Rivera', customer: 'Alex Rivera, Northwind Traders',
    about: 'PRO 0300100123 Freight Charges', type: 'New request type', stage: 'Learn', status: 'done',
    ref: 'PRO 0300100123', by: 'Operator, approved by Jordan Lee', statusNote: 'Forwarded after Jordan Lee approved',
    asked: 'A question about the freight charges on PRO 0300100123.',
    did: 'Suggested forwarding it to billing. Jordan Lee approved, and it went to your escalation contact.',
    msgs: [
      { who: 'Alex Rivera', addr: 'alex@example.test', time: 'Oct 8, 1:01 PM', body: 'Hi,\nCan someone explain the freight charges on PRO 0300100123? They look higher than quoted.\nAlex' },
      { who: 'The Operator', addr: 'To billing@example.test', time: 'Oct 8, 1:48 PM', body: 'Forwarded: a freight charge question on PRO 0300100123 from Alex Rivera at Northwind Traders.' }
    ],
    steps: [
      { title: 'Email received', sub: 'Gmail · Oct 8, 1:01 PM' },
      { title: 'Operator suggested forwarding to billing', sub: 'A freight charge question is outside the pickup desk\'s work.' },
      { title: 'Waited 46 min for approval', sub: 'Approved by Jordan Lee at 1:48 PM' },
      { title: 'Forwarded to your escalation contact', sub: 'Oct 8, 1:48 PM', mark: 'ok' }
    ] },
  { id: 'r6', agent: 'The Operator', when: 'Oct 8, 9:00 AM', channel: 'Email', from: 'Alex Rivera', customer: 'Alex Rivera, Northwind Traders',
    about: 'PRO for pickup 9900456', type: 'PRO tracking request', stage: 'Shadow', status: 'fail',
    note: 'The PRO lookup timed out.', ref: 'Pickup 9900456', by: 'Operator', statusNote: 'The PRO lookup timed out',
    ask: 'The Operator could not look up the PRO, so it made no prediction. Your team still needs to reply.', cta: 'Open in Inbox',
    asked: 'The PRO number assigned to pickup 9900456.',
    did: 'Tried to look up the PRO in the Acme system. The lookup timed out twice.',
    msgs: [
      { who: 'Alex Rivera', addr: 'alex@example.test', time: 'Oct 8, 9:00 AM', body: 'What PRO did pickup 9900456 get?\nAlex' }
    ],
    steps: [
      { title: 'Email received', sub: 'Gmail · Oct 8, 9:00 AM' },
      { title: 'Recognized as PRO tracking request', sub: 'Shadow stage, nothing is sent' },
      { title: 'PRO lookup timed out', sub: 'Tried twice', mark: 'bad' }
    ] },
  { id: 'r7', agent: 'Inbound phone line', when: 'Oct 8, 8:58 AM', channel: 'Inbound call', from: 'Casey Nguyen', customer: 'Casey Nguyen, Contoso Retail',
    about: 'Is my pickup confirmed for tomorrow?', type: 'Confirmation on a pickup', stage: 'Shadow', status: 'done',
    ref: 'Pickup 9800777', by: 'Jordan Lee', statusNote: 'Your team handled it. The prediction matched.', length: '1:42',
    asked: 'Whether tomorrow\'s pickup is confirmed.',
    did: 'Listened in Shadow and predicted Jordan would confirm the pickup. Jordan did, so the prediction counts as a match.',
    lines: [
      { who: 'Jordan Lee', text: 'Acme Logistics, this is Jordan.' },
      { who: 'Casey Nguyen', text: 'Hi, it\'s Casey at Contoso. Is our pickup confirmed for tomorrow morning?' },
      { who: 'Jordan Lee', text: 'Let me check. What\'s the pickup number?' },
      { who: 'Casey Nguyen', text: '9800777.' },
      { who: 'Jordan Lee', text: 'Got it. It\'s confirmed for tomorrow between 8 and 11.' },
      { who: 'Casey Nguyen', text: 'Perfect, thank you.' }
    ],
    steps: [
      { title: 'Call received', sub: 'Phone · Oct 8, 8:58 AM' },
      { title: 'Recognized as Confirmation on a pickup', sub: 'Shadow stage, nothing is said' },
      { title: 'Predicted: confirm the pickup window', sub: 'Pickup 9800777' },
      { title: 'Your team\'s answer matched', sub: 'Counts toward moving to Review', mark: 'ok' }
    ] },
  { id: 'r8', agent: 'The Operator', when: 'Oct 7, 11:37 AM', channel: 'Email', from: 'Alex Rivera', customer: 'Alex Rivera, Northwind Traders',
    about: 'Pickup', type: 'ETA or status request', stage: 'Review', status: 'fail',
    note: 'No draft reply was ready to send.', ref: 'None found', by: 'Operator', statusNote: 'No draft reply was ready to send',
    ask: 'The email had no pickup number, so the Operator could not draft a reply. Someone needs to answer Alex.', cta: 'Open in Inbox',
    asked: 'An update on a pickup, with no pickup number.',
    did: 'Could not find which pickup Alex meant, so no reply was drafted.',
    msgs: [
      { who: 'Alex Rivera', addr: 'alex@example.test', time: 'Oct 7, 11:37 AM', body: 'Any update on the pickup?' }
    ],
    steps: [
      { title: 'Email received', sub: 'Gmail · Oct 7, 11:37 AM' },
      { title: 'Recognized as ETA or status request', sub: 'Matched a rule in the Playbook' },
      { title: 'No pickup number found', sub: 'No draft reply was ready to send', mark: 'bad' }
    ] },
  { id: 'r9', agent: 'The Operator', when: 'Oct 6, 9:30 AM', channel: 'Email', from: 'Alex Rivera', customer: 'Alex Rivera, Northwind Traders',
    about: 'Status of pickup 9800123', type: 'ETA or status request', stage: 'Review', status: 'done',
    ref: 'Pickup 9800123', by: 'Operator, approved by Jordan Lee', statusNote: 'Sent after Jordan Lee approved',
    asked: 'The status of pickup 9800123.',
    did: 'Looked up the pickup, drafted a reply, and sent it after Jordan Lee approved it as written.',
    msgs: [
      { who: 'Alex Rivera', addr: 'alex@example.test', time: 'Oct 6, 9:30 AM', body: 'What\'s the status of pickup 9800123?\nAlex' },
      { who: 'The Operator', addr: 'To alex@example.test', time: 'Sent 9:52 AM', body: 'Hi Alex,\nPickup 9800123 is scheduled for Oct 9. We will send the PRO once it is picked up.\nThanks,\nAcme Logistics' }
    ],
    steps: [
      { title: 'Email received', sub: 'Gmail · Oct 6, 9:30 AM' },
      { title: 'Looked up pickup 9800123', sub: 'Dispatch · scheduled for Oct 9' },
      { title: 'Drafted a reply', sub: 'Oct 6, 9:31 AM' },
      { title: 'Sent after Jordan Lee approved', sub: 'Approved as written', mark: 'ok' }
    ] },
  { id: 'r10', agent: 'The Operator', when: 'Oct 6, 7:51 AM', channel: 'Text message', from: 'Sam Patel', customer: 'Sam Patel, Northwind Traders',
    about: 'POD for PRO 0100200333', type: 'Proof of delivery request', stage: 'Review', status: 'done',
    ref: 'PRO 0100200333', by: 'Operator, edited by Taylor Morgan', statusNote: 'Sent after Taylor Morgan edited and approved',
    asked: 'A copy of the proof of delivery for PRO 0100200333.',
    did: 'Found the signed delivery receipt and drafted a reply. Taylor Morgan edited the wording and sent it.',
    msgs: [
      { who: 'Sam Patel', addr: '[phone number]', time: 'Oct 6, 7:51 AM', body: 'Can I get the POD for PRO 0100200333?' },
      { who: 'The Operator', addr: 'To Sam Patel', time: 'Sent 8:05 AM', body: 'Hi Sam, here is the signed proof of delivery for PRO 0100200333: [link]' }
    ],
    steps: [
      { title: 'Text received', sub: 'Oct 6, 7:51 AM' },
      { title: 'Found the delivery receipt', sub: 'PRO 0100200333' },
      { title: 'Drafted a reply', sub: 'Oct 6, 7:52 AM' },
      { title: 'Sent after Taylor Morgan edited it', sub: 'Changed the wording', mark: 'ok' }
    ] },
  { id: 'r11', agent: 'Carrier check calls', when: 'Oct 5, 1:21 PM', channel: 'Outbound call', from: 'Carrier First', customer: 'Carrier First dispatch (partner carrier)',
    about: 'Call to check the driver\'s ETA', type: 'ETA or status request', stage: 'Review', status: 'done',
    ref: 'Pickup 9800555', by: 'Operator, approved by Jordan Lee', statusNote: 'Got the ETA and added it to the reply', length: '2:05',
    asked: 'The Operator called the partner carrier to get a driver ETA for a customer\'s pickup.',
    did: 'Called Carrier First dispatch, got the ETA, and added it to the customer reply for approval.',
    lines: [
      { who: 'Dispatcher', text: 'Carrier First dispatch.' },
      { who: 'The Operator', text: 'Hi, this is the assistant for Acme Logistics. I\'m calling about pickup 9800555. Can you share the driver\'s ETA?' },
      { who: 'Dispatcher', text: 'One sec. The driver is about 30 minutes out.' },
      { who: 'The Operator', text: 'Thank you. Is the pickup still on for today?' },
      { who: 'Dispatcher', text: 'Yes, still today.' },
      { who: 'The Operator', text: 'Great, thanks for your help.' }
    ],
    steps: [
      { title: 'Called Carrier First dispatch', sub: 'Phone · Oct 5, 1:21 PM' },
      { title: 'Got the driver ETA', sub: 'About 30 minutes out' },
      { title: 'Added the ETA to the customer reply', sub: 'Sent after Jordan Lee approved', mark: 'ok' }
    ] },
  { id: 'r12', agent: 'The Operator', when: 'Oct 5, 10:12 AM', channel: 'Email', from: 'Northwind auto-reply', customer: 'Northwind Traders',
    about: 'Out of office: Re: pickup 9800123', type: 'Auto-reply or out of office', stage: 'Review', status: 'ign',
    ref: 'Pickup 9800123', by: 'Operator', statusNote: 'Nothing to do',
    asked: 'Nothing. This was an automatic out-of-office reply.',
    did: 'Recognized the auto-reply and took no action.',
    msgs: [
      { who: 'Northwind auto-reply', addr: 'noreply@example.test', time: 'Oct 5, 10:12 AM', body: 'I am out of the office until Monday and will reply when I return.' }
    ],
    steps: [
      { title: 'Email received', sub: 'Gmail · Oct 5, 10:12 AM' },
      { title: 'Recognized as an auto-reply', sub: 'No action needed', mark: 'ok' }
    ] }
];
