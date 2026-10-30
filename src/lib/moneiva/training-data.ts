// Training threads: past email (From history, Learn) and live email (From live email, Shadow). Synthetic.

export type TrainingTab = "history" | "shadow"
/** different/new/right are history checks; mismatch/nopred/match are Shadow predictions. */
export type ThreadKind = "different" | "new" | "right" | "mismatch" | "nopred" | "match"

export type ThreadEmail = {
  who: string
  addr: string
  time: string
  body: string
  /** What the Operator would have done (history) or predicted (Shadow) after this email. */
  op: string
  /** What your team did after this email. */
  team?: string
  isTeam?: boolean
}

export type Thread = {
  id: string
  tab: TrainingTab
  group: "check" | "right"
  kind: ThreadKind
  subject: string
  from: string
  date: string
  type: string
  would?: string
  did: string
  newName?: string
  newDesc?: string
  /** Prefilled answer in the Not right dialog. */
  fix: string
  /** Prefilled When and Then in the Make a rule dialog. */
  when: string
  then: string
  emails: ThreadEmail[]
  actions: { text: string; kind: string }[]
  learned: { label: string; text: string }[]
}

export const THREADS: Thread[] = [
  { id: 'h1', tab: 'history', group: 'check', kind: 'different', subject: 'account 1100456', from: 'Sam Patel', date: 'Sep 24', type: 'Account hours correction',
    would: 'Update the closing time to 16:00 and reply to confirm.',
    did: 'Nothing to the account, because Sam had already changed it. Replied, and asked IT why the receipt still prints 16:30.',
    newName: 'Account hours correction', newDesc: 'A staff member asks the desk to fix stored account hours (closing, consignee or receiving) that show or print incorrectly.',
    fix: 'Sam already changed the hours, so don\'t touch the account. Reply to Sam and ask IT why the receipt still prints the old time.',
    when: 'the person says they already made the change themselves', then: 'don\'t update the account. Reply to confirm, and ask IT to check why it shows differently.',
    emails: [
      { who: 'Sam Patel', addr: 'sam@example.test', time: 'Sep 24, 9:12 AM', body: 'Hi team,\nThe closing time on account 1100456 should be 4:00 PM, not 4:30. Can you fix it?\nThanks,\nSam', op: 'Update the closing time to 16:00 and reply to confirm.' },
      { who: 'Sam Patel', addr: 'sam@example.test', time: 'Sep 24, 10:05 AM', body: 'Never mind, I updated it myself on the account screen. But the receipt still prints 16:30. Why?', team: 'No change to the account.', op: 'Still update the closing time, then reply. It missed that Sam already did it.' },
      { who: 'Jordan Lee', addr: 'To sam@example.test', time: 'Sep 24, 10:40 AM', isTeam: true, body: 'Hi Sam,\nThanks for fixing the hours. We asked IT why the receipt still shows 16:30 and will follow up once it prints correctly.\nCustomer Service Team', team: 'Replied to Sam and opened a ticket with IT about the receipt.', op: 'Follow up with Sam once the receipt is fixed.' }
    ],
    actions: [
      { text: 'Investigate why the receipt prints 16:30 while the screen shows 16:00', kind: 'System update' },
      { text: 'Reply to Sam confirming receipt and next steps', kind: 'Email reply' },
      { text: 'Follow up with Sam once the receipt is corrected', kind: 'Follow-up' }
    ],
    learned: [
      { label: 'New request type', text: 'Account hours correction' },
      { label: 'Fact', text: 'Staff can change account hours themselves on the account screen.' },
      { label: 'Fact', text: 'Receipts can print old account hours after a change. IT fixes that.' }
    ] },
  { id: 'h2', tab: 'history', group: 'check', kind: 'different', subject: 'Help Needed with Probill 187700', from: 'Riley Chen', date: 'Sep 24', type: 'Reconsignment request',
    would: 'Reply that a reconsignment needs a signed request form, and attach the form.',
    did: 'Jordan called Riley, confirmed the new address by phone and changed it in the system the same day.',
    fix: 'For a same-day reconsignment, call the customer to confirm the new address, then update it in the system.',
    when: 'the freight has not been delivered and the customer needs it changed today', then: 'call the customer to confirm the new address and update it in the system. Skip the form.',
    emails: [
      { who: 'Riley Chen', addr: 'riley@example.test', time: 'Sep 24, 8:02 AM', body: 'Hello,\nProbill 187700 needs to go to our Tampa warehouse instead of Orlando. It\'s on the truck today. Can you help?\nRiley', op: 'Reply with the reconsignment form and ask Riley to sign it.' },
      { who: 'Jordan Lee', addr: 'To riley@example.test', time: 'Sep 24, 8:30 AM', isTeam: true, body: 'Hi Riley,\nThanks for the call. Probill 187700 now delivers to Tampa today.\nCustomer Service Team', team: 'Called Riley, then changed the delivery address in the system.', op: 'Close the request.' }
    ],
    actions: [
      { text: 'Send Riley the reconsignment request form', kind: 'Email reply' },
      { text: 'Wait for the signed form before changing the address', kind: 'Follow-up' }
    ],
    learned: [ { label: 'Fact', text: 'Same-day reconsignments are handled by phone, without the form.' } ] },
  { id: 'h3', tab: 'history', group: 'check', kind: 'different', subject: 'Northwind routing guide', from: 'Alex Rivera', date: 'Sep 24', type: 'New pickup request',
    would: 'Treat it as a new pickup request and ask Alex for a pickup date.',
    did: 'Saved the routing guide to the Northwind account. No pickup was booked.',
    fix: 'This is a document to keep, not a pickup. Save it to the account and reply that it was received.',
    when: 'a customer sends a routing guide or other reference document', then: 'save it to the account and reply that it was received. Don\'t book anything.',
    emails: [
      { who: 'Alex Rivera', addr: 'alex@example.test', time: 'Sep 24, 2:14 PM', body: 'Hi,\nAttached is our updated routing guide for all Northwind stores. Please use it going forward.\nAlex', op: 'Ask Alex when the pickup should be.' },
      { who: 'Taylor Morgan', addr: 'To alex@example.test', time: 'Sep 24, 3:01 PM', isTeam: true, body: 'Thanks Alex, we saved the new routing guide to your account.\nCustomer Service Team', team: 'Saved the guide to the account and replied.', op: 'Close the request.' }
    ],
    actions: [ { text: 'Ask Alex for the pickup date and address', kind: 'Email reply' } ],
    learned: [ { label: 'Document', text: 'Northwind routing guide.pdf, added to Playbook' } ] },
  { id: 'h4', tab: 'history', group: 'check', kind: 'new', subject: 'Pick Up Request Load 5640000', from: 'Casey Nguyen', date: 'Sep 24', type: 'New request type',
    would: 'Book the pickup using the load number.',
    did: 'Asked Casey for the pickup address first, then booked it.',
    newName: 'Pickup request by load number', newDesc: 'A customer asks for a pickup and gives only a load number, without a pickup address.',
    fix: 'When only a load number is given, ask for the pickup address before booking.',
    when: 'a pickup request has a load number but no pickup address', then: 'ask for the pickup address before booking.',
    emails: [
      { who: 'Casey Nguyen', addr: 'casey@example.test', time: 'Sep 24, 11:20 AM', body: 'Please pick up load 5640000 tomorrow.\nCasey', op: 'Book a pickup for load 5640000 tomorrow.' },
      { who: 'Jordan Lee', addr: 'To casey@example.test', time: 'Sep 24, 11:45 AM', isTeam: true, body: 'Hi Casey,\nHappy to. What address should the driver go to?\nCustomer Service Team', team: 'Asked for the address, then booked the pickup after Casey replied.', op: 'Book the pickup once the address arrives.' }
    ],
    actions: [ { text: 'Book a pickup for load 5640000 for tomorrow', kind: 'System update' } ],
    learned: [ { label: 'New request type', text: 'Pickup request by load number' } ] },
  { id: 'h5', tab: 'history', group: 'right', kind: 'right', subject: 'PRO 876500111 / 0098000222', from: 'Alex Rivera', date: 'Sep 24', type: 'Delivery appointment',
    did: 'Set the delivery appointment for Oct 1, 9 AM and confirmed it with Alex.',
    fix: '', when: 'a customer asks for a delivery appointment', then: 'offer the first open morning slot.',
    emails: [
      { who: 'Alex Rivera', addr: 'alex@example.test', time: 'Sep 24, 9:40 AM', body: 'Can we set a delivery appointment for PRO 876500111 next Wednesday morning?', op: 'Set the appointment for Oct 1, 9 AM and confirm.' },
      { who: 'Jordan Lee', addr: 'To alex@example.test', time: 'Sep 24, 10:02 AM', isTeam: true, body: 'Hi Alex, you\'re set for Oct 1 at 9 AM.\nCustomer Service Team', team: 'Set the appointment and confirmed.', op: 'Close the request.' }
    ],
    actions: [ { text: 'Set the delivery appointment for Oct 1, 9 AM', kind: 'System update' }, { text: 'Confirm the appointment with Alex', kind: 'Email reply' } ],
    learned: [ { label: 'Fact', text: 'Morning delivery appointments start at 9 AM.' } ] },
  { id: 'h6', tab: 'history', group: 'right', kind: 'right', subject: 'Acme tracking 0100200333', from: 'Sam Patel', date: 'Sep 24', type: 'ETA or status request',
    did: 'Replied with the current status from the Acme lookup.', fix: '', when: 'a customer asks for status', then: 'reply with the latest status from the lookup.',
    emails: [
      { who: 'Sam Patel', addr: 'sam@example.test', time: 'Sep 24, 1:10 PM', body: 'Where is 0100200333?', op: 'Reply with the latest status from the Acme lookup.' },
      { who: 'Taylor Morgan', addr: 'To sam@example.test', time: 'Sep 24, 1:25 PM', isTeam: true, body: 'Hi Sam, 0100200333 is out for delivery today.\nCustomer Service Team', team: 'Replied with the status.', op: 'Close the request.' }
    ],
    actions: [ { text: 'Reply with the latest status', kind: 'Email reply' } ],
    learned: [ { label: 'Fact', text: 'Status questions are answered from the Acme lookup.' } ] },
  { id: 'h7', tab: 'history', group: 'right', kind: 'right', subject: 'UC shipments due today', from: 'Riley Chen', date: 'Sep 24', type: 'ETA or status request',
    did: 'Replied with a list of today\'s deliveries and their status.', fix: '', when: 'a customer asks about several shipments', then: 'reply with one line per shipment.',
    emails: [
      { who: 'Riley Chen', addr: 'riley@example.test', time: 'Sep 24, 7:45 AM', body: 'Can you send the status of all UC shipments due today?', op: 'Reply with one line per shipment due today.' },
      { who: 'Jordan Lee', addr: 'To riley@example.test', time: 'Sep 24, 8:10 AM', isTeam: true, body: 'Hi Riley, here are today\'s UC shipments: [list]\nCustomer Service Team', team: 'Replied with the list.', op: 'Close the request.' }
    ],
    actions: [ { text: 'Reply with one line per shipment due today', kind: 'Email reply' } ],
    learned: [ { label: 'Fact', text: 'Riley asks for a daily list of UC shipments.' } ] },

  { id: 's1', tab: 'shadow', group: 'check', kind: 'mismatch', subject: 'pickup 9900456', from: 'Alex Rivera', date: 'Oct 9', type: 'Confirmation on a pickup',
    would: 'Confirm the pickup for Oct 10.', did: 'Jordan replied that the pickup moved to Oct 11, because the driver was rerouted.',
    fix: 'Check dispatch for a changed date before confirming a pickup.', when: 'dispatch shows a changed pickup date', then: 'give the new date, not the original one.',
    emails: [
      { who: 'Alex Rivera', addr: 'alex@example.test', time: 'Oct 9, 8:21 AM', body: 'Can you confirm this got scheduled?\nAlex', op: 'Confirm the pickup for Oct 10.' },
      { who: 'Jordan Lee', addr: 'To alex@example.test', time: 'Oct 9, 9:02 AM', isTeam: true, body: 'Hi Alex,\nPickup 9900456 moved to Oct 11. The driver was rerouted.\nCustomer Service Team', team: 'Checked dispatch and gave the new date.', op: 'Nothing more.' }
    ],
    actions: [ { text: 'Reply confirming the pickup for Oct 10', kind: 'Email reply' } ],
    learned: [ { label: 'Fact', text: 'Check dispatch for date changes before confirming.' } ] },
  { id: 's2', tab: 'shadow', group: 'check', kind: 'mismatch', subject: 'Freight bill question PRO 0300100124', from: 'Sam Patel', date: 'Oct 8', type: 'Billing or rate dispute',
    would: 'Forward the email to billing.', did: 'Taylor answered directly from the rate sheet. It was a fuel surcharge question.',
    fix: 'Answer fuel surcharge questions from the rate sheet. Forward only disputes.', when: 'the question is only about the fuel surcharge', then: 'answer from the rate sheet instead of forwarding to billing.',
    emails: [
      { who: 'Sam Patel', addr: 'sam@example.test', time: 'Oct 8, 3:12 PM', body: 'Why is there a fuel charge on PRO 0300100124?', op: 'Forward to billing.' },
      { who: 'Taylor Morgan', addr: 'To sam@example.test', time: 'Oct 8, 3:30 PM', isTeam: true, body: 'Hi Sam, that\'s the weekly fuel surcharge from our rate sheet: [link]\nCustomer Service Team', team: 'Answered from the rate sheet.', op: 'Nothing more.' }
    ],
    actions: [ { text: 'Forward the email to billing', kind: 'Email reply' } ],
    learned: [ { label: 'Fact', text: 'Fuel surcharge questions are answered from the rate sheet.' } ] },
  { id: 's3', tab: 'shadow', group: 'check', kind: 'nopred', subject: 'Delivery Status Notification (Failure)', from: 'Mail delivery system', date: 'Oct 7', type: 'Delivery bounce notice',
    would: 'Nothing. It recognized the bounce but did not predict a step.', did: 'Taylor fixed the email address on the account and resent the last update.',
    fix: 'When an update bounces, fix the address on the account and resend.', when: 'an email to a customer bounces', then: 'flag the address for a fix and resend the last update.',
    emails: [
      { who: 'Mail delivery system', addr: 'mailer-daemon@example.test', time: 'Oct 7, 4:02 PM', body: 'Your message to rivera@example.test could not be delivered.', op: 'No prediction.' }
    ],
    actions: [],
    learned: [ { label: 'Fact', text: 'Bounced updates mean the address on the account is wrong.' } ] },
  { id: 's4', tab: 'shadow', group: 'right', kind: 'match', subject: 'PRO for pickup 9900123', from: 'Alex Rivera', date: 'Oct 6', type: 'PRO tracking request',
    would: 'Reply with the PRO for the pickup.', did: 'Replied with the PRO for the pickup.', fix: '', when: 'a customer asks for a PRO', then: 'reply with the PRO from the lookup.',
    emails: [
      { who: 'Alex Rivera', addr: 'alex@example.test', time: 'Oct 6, 10:15 AM', body: 'What PRO did pickup 9900123 get?', op: 'Reply with the PRO.' },
      { who: 'Jordan Lee', addr: 'To alex@example.test', time: 'Oct 6, 10:40 AM', isTeam: true, body: 'Hi Alex, pickup 9900123 is PRO 0300100555.\nCustomer Service Team', team: 'Replied with the PRO.', op: 'Nothing more.' }
    ],
    actions: [ { text: 'Reply with the PRO', kind: 'Email reply' } ], learned: [] },
  { id: 's5', tab: 'shadow', group: 'right', kind: 'match', subject: 'Is my pickup confirmed for tomorrow?', from: 'Casey Nguyen', date: 'Oct 8', type: 'Confirmation on a pickup',
    would: 'Confirm the pickup window.', did: 'Jordan confirmed the pickup window on the call.', fix: '', when: 'a caller asks to confirm a pickup', then: 'confirm the window from dispatch.',
    emails: [
      { who: 'Casey Nguyen', addr: 'Inbound call', time: 'Oct 8, 8:58 AM', body: 'Is our pickup confirmed for tomorrow morning? It\'s 9800777.', op: 'Confirm the pickup window.', team: 'Jordan confirmed 8 to 11 AM.' }
    ],
    actions: [ { text: 'Confirm the pickup window', kind: 'Phone call' } ], learned: [] },
  { id: 's6', tab: 'shadow', group: 'right', kind: 'match', subject: 'Need appointment for PRO 0100200444', from: 'Riley Chen', date: 'Oct 6', type: 'Delivery appointment',
    would: 'Offer the first open morning slot.', did: 'Offered the first open morning slot.', fix: '', when: 'a customer asks for an appointment', then: 'offer the first open morning slot.',
    emails: [
      { who: 'Riley Chen', addr: 'riley@example.test', time: 'Oct 6, 2:00 PM', body: 'Can we get a delivery appointment for PRO 0100200444?', op: 'Offer the first open morning slot.' },
      { who: 'Taylor Morgan', addr: 'To riley@example.test', time: 'Oct 6, 2:20 PM', isTeam: true, body: 'Hi Riley, we can do Oct 8 at 9 AM.\nCustomer Service Team', team: 'Offered Oct 8, 9 AM.', op: 'Nothing more.' }
    ],
    actions: [ { text: 'Offer Oct 8, 9 AM', kind: 'Email reply' } ], learned: [] }
];

export type HistoryRun = { id: string; label: string; sub: string; latest?: boolean }
export const RUNS: HistoryRun[] = [
  { id: "r3", label: "Sep 29", sub: "38 threads from Sep 1 to Sep 28", latest: true },
  { id: "r2", label: "Sep 22", sub: "41 threads from Aug 15 to Aug 31 · all checked" },
  { id: "r1", label: "Sep 16", sub: "First import · 120 threads · all checked" },
]
export const LATEST_RUN = "r3"

/** The mailbox that feeds Training. Importing lives on the Training page because this is what it trains on. */
export const EMAIL_SOURCE = {
  mailbox: "service@example.test",
  meta: "199 threads in 3 imports · last import Sep 29 by Taylor Morgan · 8 facts learned",
  readingMeta: "Importing the last 6 months · started today by Taylor Morgan",
  readingDone: 472,
  readingTotal: 1240,
}

/** Demo states for Training: ready (has threads), empty (nothing imported) and reading (first import running). */
export type TrainingPhase = "ready" | "empty" | "reading"

export const WRONG_REASONS = ["Not needed", "Wrong action", "Right action, wrong details"] as const

/** The status box at the top of a thread: title, tone, and the label for what the Operator did. */
export const KIND_BOX: Record<ThreadKind, { title: string; tone: "red" | "amber" | "green"; wouldLabel: string }> = {
  different: { title: "Your team did something different", tone: "red", wouldLabel: "The Operator would have" },
  new: { title: "New kind of email", tone: "amber", wouldLabel: "The Operator would have" },
  right: { title: "Looks right", tone: "green", wouldLabel: "" },
  mismatch: { title: "The prediction did not match your team", tone: "red", wouldLabel: "The Operator predicted" },
  nopred: { title: "The Operator had no prediction", tone: "amber", wouldLabel: "The Operator predicted" },
  match: { title: "The prediction matched your team", tone: "green", wouldLabel: "" },
}

export const TAB_COPY: Record<TrainingTab, { hint: string; groups: { check: string; right: string }; opLabel: string }> = {
  history: {
    hint: "Threads from your past email. The Operator says what it would have done, next to what your team actually did.",
    groups: { check: "Check first", right: "Looks right" },
    opLabel: "After this email, the Operator would have:",
  },
  shadow: {
    hint: "Live email the Operator watched in Shadow. Nothing was sent. Its prediction sits next to what your team did.",
    groups: { check: "Didn't match", right: "Matched" },
    opLabel: "The Operator predicted:",
  },
}
