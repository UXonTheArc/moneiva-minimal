"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Mail, MessageSquare, PhoneIncoming, PhoneOutgoing, Search, SlidersHorizontal, X } from "lucide-react"

import { markDone, useDone } from "@/components/m/store"
import { Details, Dot, Group, Icon, PageTitle, Row, Segmented, Section, Steps, btn } from "@/components/m/ui"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { ACTIVITY, FILTER_MENUS, INBOX_LINK, STATUS_LABEL, type ActivityChannel, type ActivityRow, type ActivityStatus } from "@/lib/moneiva/activity-data"

export type Filter = "all" | "needs" | "fail"
const CHANNELS = FILTER_MENUS.find((m) => m.key === "channel")!.opts
const TYPES = FILTER_MENUS.find((m) => m.key === "type")!.opts
const TONE: Record<ActivityStatus, "ok" | "warn" | "bad" | "off" | "blue"> = { needs: "warn", prog: "blue", done: "ok", fail: "bad", ign: "off" }

function ChannelIcon({ c }: { c: ActivityChannel }) {
  if (c === "Email") return <Mail />
  if (c === "Inbound call") return <PhoneIncoming />
  if (c === "Outbound call") return <PhoneOutgoing />
  return <MessageSquare />
}

const reviewLink = (id: string) => INBOX_LINK[id]?.replace("/inbox", "/review").replace(/filter=call&/, "")
const reviewId = (id: string) => INBOX_LINK[id]?.match(/item=(\w+)/)?.[1]

/** Activity and Review show the same work: once it is handled in Review, it is done here too. */
function useRows() {
  const isDone = useDone()
  return ACTIVITY.map((r) => {
    const item = r.status === "needs" ? reviewId(r.id) : undefined
    return item && isDone(item) ? { ...r, status: "done" as const, statusNote: "Handled in Review" } : r
  })
}

export function Activity({ initialAgent, initialFilter = "all" }: { initialAgent?: string; initialFilter?: Filter }) {
  const [filter, setFilter] = useState<Filter>(initialFilter)

  // Opening Activity counts as seeing what couldn't finish, so the dot on the icon clears.
  useEffect(() => markDone("seen-fails"), [])
  const [agent, setAgent] = useState(initialAgent)
  const [q, setQ] = useState("")
  const [channels, setChannels] = useState<string[]>([])
  const [types, setTypes] = useState<string[]>([])
  const toggle = (list: string[], set: (v: string[]) => void, v: string) => set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v])
  const [open, setOpen] = useState<ActivityRow | null>(null)

  const all = useRows()
  const rows = all.filter(
    (r) =>
      (filter === "all" || r.status === filter) &&
      (!agent || r.agent === agent) &&
      (!channels.length || channels.includes(r.channel)) &&
      (!types.length || types.includes(r.type)) &&
      (!q.trim() || `${r.about} ${r.customer} ${r.ref} ${r.type}`.toLowerCase().includes(q.trim().toLowerCase()))
  )
  const days = [...new Set(rows.map((r) => r.when.split(",")[0]))]

  return (
    <>
      <PageTitle
        title="Activity"
        lead="Every email and call your agents handled, and exactly what they did."
        action={
          <Segmented
            value={filter}
            onChange={setFilter}
            options={[
              { value: "all", label: "All" },
              { value: "needs", label: "Needs you" },
              { value: "fail", label: "Couldn't finish" },
            ]}
          />
        }
      />

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by customer, pickup or PRO"
            className="h-11 w-full rounded-xl bg-card pr-4 pl-10 text-[15px] shadow-[0_1px_2px_rgb(0_0_0/0.04)] outline-none placeholder:text-muted-foreground focus:ring-4 focus:ring-primary/15"
          />
        </div>
        <Popover>
          <PopoverTrigger className="inline-flex h-11 items-center gap-2 rounded-xl bg-card px-4 text-[15px] font-medium shadow-[0_1px_2px_rgb(0_0_0/0.04)] hover:shadow-md">
            <SlidersHorizontal className="size-4" />
            Filter
            {channels.length + types.length > 0 && (
              <span className="grid size-5 place-items-center rounded-full bg-primary text-[11px] text-primary-foreground">{channels.length + types.length}</span>
            )}
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 rounded-2xl p-4">
            {(
              [
                ["Channel", CHANNELS, channels, setChannels],
                ["Kind of email", TYPES, types, setTypes],
              ] as const
            ).map(([title, opts, list, set]) => (
              <div key={title} className="mb-4 last:mb-0">
                <div className="mb-2 text-[13px] font-semibold text-muted-foreground">{title}</div>
                <div className="flex flex-wrap gap-2">
                  {opts.map((o) => (
                    <button
                      key={o}
                      onClick={() => toggle(list, set, o)}
                      className={cn(
                        "h-8 rounded-full border px-3 text-[13px] transition",
                        list.includes(o) ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted"
                      )}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </PopoverContent>
        </Popover>
        {[...channels, ...types].map((v) => (
          <button
            key={v}
            onClick={() => (channels.includes(v) ? toggle(channels, setChannels, v) : toggle(types, setTypes, v))}
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-foreground px-4 text-[13px] font-medium text-background"
          >
            {v}
            <X className="size-3.5" />
          </button>
        ))}
        {agent && (
          <button onClick={() => setAgent(undefined)} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-foreground px-4 text-[13px] font-medium text-background">
            {agent}
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {days.map((d) => (
        <Section key={d} title={d}>
          <Group>
            {rows
              .filter((r) => r.when.startsWith(d + ","))
              .map((r) => (
                <Row
                  key={r.id}
                  onClick={() => setOpen(r)}
                  icon={
                    <Icon>
                      <ChannelIcon c={r.channel} />
                    </Icon>
                  }
                  title={r.about}
                  sub={`${r.customer} · ${r.agent}`}
                  value={
                    <span className="inline-flex items-center gap-2">
                      <span className="hidden sm:inline">{r.when.split(", ")[1]}</span>
                      <Dot tone={TONE[r.status]} />
                    </span>
                  }
                />
              ))}
          </Group>
        </Section>
      ))}
      {!rows.length && <p className="px-1 text-[15px] text-muted-foreground">Nothing matches.</p>}

      <Sheet open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <SheetContent className="flex w-full flex-col gap-0 overflow-y-auto p-0 sm:max-w-lg">
          {open && <Detail r={open} />}
        </SheetContent>
      </Sheet>
    </>
  )
}

function Detail({ r }: { r: ActivityRow }) {
  const link = r.status === "needs" ? reviewLink(r.id) : undefined
  return (
    <>
      <SheetHeader className="border-b border-border p-6">
        <SheetTitle className="text-[22px] font-semibold tracking-tight">{r.about}</SheetTitle>
        <SheetDescription className="text-[15px]">
          {r.customer} · {r.when}
        </SheetDescription>
      </SheetHeader>
      <div className="p-6">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-[13px] font-medium">
          <Dot tone={TONE[r.status]} />
          {STATUS_LABEL[r.status]}
          {r.statusNote && r.statusNote !== STATUS_LABEL[r.status] && <span className="font-normal text-muted-foreground">· {r.statusNote}</span>}
        </div>
        <dl className="space-y-5">
          <div>
            <dt className="text-[13px] font-semibold text-muted-foreground">They asked</dt>
            <dd className="mt-1 text-[17px] leading-relaxed">{r.asked}</dd>
          </div>
          <div>
            <dt className="text-[13px] font-semibold text-muted-foreground">{r.agent} did</dt>
            <dd className="mt-1 text-[17px] leading-relaxed">{r.did}</dd>
          </div>
        </dl>
        {link && (
          <Link href={link} className={cn(btn.primary, "mt-6")}>
            Review it
          </Link>
        )}
      </div>
      <div className="border-t border-border p-6">
        <Details>
          {r.lines && (
            <>
              <div className="mb-3 text-[13px] font-semibold text-muted-foreground">The call{r.length ? `, ${r.length}` : ""}</div>
              <div className="mb-6 space-y-2">
                {r.lines.map((l, i) => {
                  const ours = !l.who.includes(" ") || l.who === "Phone line"
                  return (
                    <div key={i} className={cn("flex", ours ? "justify-end" : "justify-start")}>
                      <div className={cn("max-w-[85%] rounded-2xl px-4 py-2 text-[14px]", ours ? "bg-primary text-primary-foreground" : "bg-muted")}>{l.text}</div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
          {r.msgs && (
            <>
              <div className="mb-3 text-[13px] font-semibold text-muted-foreground">The emails</div>
              <div className="mb-6 space-y-3">
                {r.msgs.map((m, i) => (
                  <div key={i} className={cn("rounded-xl border border-border p-4", m.draft && "border-dashed")}>
                    <div className="mb-1 flex justify-between gap-3 text-[13px] text-muted-foreground">
                      <span className="font-medium text-foreground">{m.who}</span>
                      <span>{m.time}</span>
                    </div>
                    <div className="text-[14px] leading-relaxed whitespace-pre-wrap">{m.body}</div>
                  </div>
                ))}
              </div>
            </>
          )}
          <div className="mb-3 text-[13px] font-semibold text-muted-foreground">Step by step</div>
          <Steps steps={r.steps.map((s) => ({ title: s.title, sub: s.sub, state: s.mark === "bad" ? "fail" : s.mark === "wait" ? "now" : "done" }))} />
          <dl className="mt-6 grid grid-cols-2 gap-4 text-[13px]">
            <div>
              <dt className="text-muted-foreground">Kind of email</dt>
              <dd className="mt-0.5 font-medium">{r.type}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Reference</dt>
              <dd className="mt-0.5 font-medium">{r.ref}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Channel</dt>
              <dd className="mt-0.5 font-medium">{r.channel}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Step</dt>
              <dd className="mt-0.5 font-medium">{r.stage}</dd>
            </div>
          </dl>
        </Details>
      </div>
    </>
  )
}
