// Playbook data that is not shared with other sections. Synthetic.
import { DOCS } from "@/lib/moneiva/data"

const RATE = DOCS[1].name
const ROUTE = DOCS[0].name
const DOCKS = DOCS[2].name
const EMAIL = "Your email history"

export type Fact = { text: string; src: string }
export type KnowsGroup = { name: string; facts: Fact[] }

const CITIES = [
  "Miami", "Atlanta", "Dallas", "Houston", "Memphis", "Nashville", "Charlotte", "Orlando", "Tampa", "Jacksonville",
  "Birmingham", "New Orleans", "Little Rock", "Louisville", "Columbus", "Indianapolis", "Chicago", "St. Louis",
  "Kansas City", "Oklahoma City", "Austin", "San Antonio", "Phoenix", "Denver", "Raleigh", "Richmond",
]
const HOURS = ["8:00 AM to 4:30 PM", "7:00 AM to 5:00 PM", "6:00 AM to 3:00 PM"]

/** What the Operator knows: 48 facts from documents and email history. */
export const KNOWS: KnowsGroup[] = [
  {
    name: "Rules and fees",
    facts: [
      { text: "Shipments valued over USD 100,000 are High Value Cargo and must be disclosed before dispatch.", src: RATE },
      { text: "Liftgate service is an extra charge and must be asked for at booking.", src: RATE },
      { text: "Residential deliveries carry an extra fee.", src: RATE },
      { text: "Storage starts after 2 free days at the terminal.", src: RATE },
      { text: "A reweigh fee applies when the weight on the BOL is wrong.", src: RATE },
    ],
  },
  {
    name: "How carriers work",
    facts: [
      { text: "Acme drivers finish deliveries first, then start pickups.", src: EMAIL },
      { text: "A PRO number that doesn't pull up in Acme usually means the freight hasn't been picked up yet.", src: EMAIL },
      { text: "Pickups booked after 2 PM usually go out the next day.", src: EMAIL },
      { text: "Customers often send a pickup number instead of a PRO.", src: EMAIL },
      { text: 'Your team signs replies "Customer Service Team".', src: EMAIL },
      { text: "Billing questions go to the billing team, not the pickup desk.", src: EMAIL },
      { text: "Your team asks for a reference before looking up a pickup.", src: EMAIL },
      { text: "Reschedules are handled by phone.", src: EMAIL },
      { text: "Northwind freight over 10 pallets ships as a full truckload.", src: ROUTE },
      { text: "Northwind wants a call 30 minutes before delivery.", src: ROUTE },
      { text: "Northwind store deliveries need an appointment.", src: ROUTE },
      { text: "The Northwind PO number is the main reference.", src: ROUTE },
      { text: "Northwind does not take Saturday deliveries.", src: ROUTE },
      { text: "Pallets must be no taller than 72 inches.", src: ROUTE },
      { text: "Hazmat freight needs its paperwork before pickup.", src: ROUTE },
      { text: "Damaged freight must be reported within 24 hours.", src: ROUTE },
      { text: "The Northwind routing guide applies to all their stores.", src: ROUTE },
    ],
  },
  {
    name: "Sites and docks",
    facts: CITIES.map((c, i) => ({ text: `${c} dock, [address]: open ${HOURS[i % 3]}.`, src: DOCKS })),
  },
]

export const FACT_COUNT = KNOWS.reduce((n, g) => n + g.facts.length, 0)

/** Learn types link to the matching "name this request type" item in Inbox. */
export const LEARN_INBOX_ITEM: Record<string, string> = {
  "Pickup status without a reference": "n1",
  "Freight charges inquiry by PRO": "n2",
  "Freight charges on an existing shipment": "n3",
}

/** What each document taught the Operator, so people can check it line by line. */
export const factsFrom = (doc: string) => KNOWS.flatMap((g) => g.facts.filter((f) => f.src === doc).map((f) => ({ ...f, group: g.name })))

/** The document the mockup "uploads" when someone clicks Upload documents. */
export const NEW_DOC = {
  name: "Holiday closures 2026.pdf",
  kind: "PDF",
  facts: [
    { text: "All docks are closed on Thanksgiving Day, Nov 26.", group: "Sites and docks" },
    { text: "Pickups booked for Nov 27 run on a half-day schedule, 8:00 AM to 12:00 PM.", group: "Sites and docks" },
    { text: "The Miami dock is closed Dec 24 to Dec 26.", group: "Sites and docks" },
    { text: "Customers get a holiday notice 5 business days before a closure.", group: "How carriers work" },
  ],
}

