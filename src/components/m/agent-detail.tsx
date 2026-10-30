"use client"

import Link from "next/link"
import { useState } from "react"
import { AlertCircle, ArrowRight, History, IdCard, Route, Wrench, Workflow as WorkflowIcon } from "lucide-react"
import { toast } from "sonner"

import { BackLink } from "@/components/m/automate"
import { KindIcon } from "@/components/m/kind-icon"
import { Card, Group, Icon, Journey, Row, Section, Steps, btn } from "@/components/m/ui"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import type { Agent } from "@/lib/moneiva/agents-data"
import { FLOWS, RUNSET, USED } from "@/lib/moneiva/agents-extra-data"
import { REQUEST_TYPES, STAGES } from "@/lib/moneiva/data"
import { AGENT_STAGE, REVIEW_ITEMS, STAGE_INFO, WORKFLOWS } from "@/lib/minimal"
import { useDone } from "@/components/m/store"

type Panel = "who" | "tools" | "how" | null
const NUMBERS = ["(555) 010-0211", "(555) 010-0233", "(555) 010-0275"]

export function AgentDetail({ agent: a }: { agent: Agent }) {
  const [broken, setBroken] = useState(a.status === "error")
  const [on, setOn] = useState(a.status !== "off" && a.status !== "paused")
  const [picking, setPicking] = useState(false)
  const [panel, setPanel] = useState<Panel>(null)
  const [moved, setMoved] = useState(false)
  const stage = AGENT_STAGE[a.id]
  const isDone = useDone()
  const needs = REVIEW_ITEMS.filter((i) => !isDone(i.id) && (i.kind === "call" ? i.agent === a.name : a.id === "op")).length
  const isOp = a.id === "op"
  const ready = REQUEST_TYPES.find((t) => t.flag === "ready")

  return (
    <>
      <BackLink href="/automate" label="Automate" />

      <div className="mb-10 flex flex-wrap items-center gap-5">
        <span className="grid size-16 place-items-center rounded-[18px] bg-card shadow-sm [&_svg]:size-7">
          <KindIcon kind={a.kind} />
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="text-[34px] leading-tight font-bold tracking-tight">{a.name}</h1>
          <p className="text-[15px] text-muted-foreground">{a.channel}</p>
        </div>
        <label className="flex items-center gap-3 text-[15px] font-medium">
          {on ? "On" : "Off"}
          <Switch
            checked={on}
            onCheckedChange={(v) => {
              setOn(v)
              toast(v ? `${a.name} is on` : `${a.name} is off. Its work goes to Review for a person.`)
            }}
          />
        </label>
      </div>

      {broken && (
        <Card className="mb-6 p-5 ring-1 ring-destructive/30 sm:p-6">
          <div className="flex items-start gap-4">
            <Icon tone="red">
              <AlertCircle />
            </Icon>
            <div className="flex-1">
              <div className="text-[17px] font-semibold">It stopped at 7:10 AM</div>
              <p className="mt-1 text-[15px] text-muted-foreground">Its phone number can no longer place calls. Pick another number and it starts again.</p>
              {picking ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {NUMBERS.map((n) => (
                    <button
                      key={n}
                      className={btn.secondary}
                      onClick={() => {
                        setBroken(false)
                        toast.success(`Calling from ${n}. ${a.name} is running again.`)
                      }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              ) : (
                <button className={cn(btn.primary, "mt-4")} onClick={() => setPicking(true)}>
                  Pick a number
                </button>
              )}
            </div>
          </div>
        </Card>
      )}

      <div className="mb-10 grid gap-3 sm:grid-cols-2">
        <Card className="p-6">
          <div className="text-[48px] leading-none font-bold tracking-tight">{a.today}</div>
          <p className="mt-2 text-[15px] text-muted-foreground">{a.todayLabel}</p>
          {needs > 0 && (
            <Link href={a.kind === "inbound" ? "/review?item=c1" : "/review"} className={cn(btn.plain, "mt-4")}>
              {a.kind === "inbound" ? `${needs} call to return` : `${needs} to review`}
              <ArrowRight className="size-4" />
            </Link>
          )}
        </Card>
        <Card className="p-6">
          <div className="mb-4 text-[15px] font-semibold">{STAGE_INFO[stage].label}</div>
          <Journey stage={stage} />
          <p className="mt-4 text-[13px] text-muted-foreground">
            {isOp ? "Each kind of email moves on its own. Most are shadowing your team." : STAGE_INFO[stage].sub}
          </p>
        </Card>
      </div>

      {isOp && ready && !moved && (
        <Card className="mb-10 flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
          <div className="flex-1">
            <div className="text-[17px] font-semibold">{ready.name} is ready to move up</div>
            <p className="mt-1 text-[15px] text-muted-foreground">
              It matched your team {ready.matched} of {ready.of} times. Move it to Reviewing and it starts writing replies for you to approve.
            </p>
          </div>
          <button
            className={btn.primary}
            onClick={() => {
              setMoved(true)
              toast.success(`${ready.name} moved to Reviewing`)
            }}
          >
            Move up
          </button>
        </Card>
      )}

      <Section title="What it does">
        <Card className="p-6 text-[17px] leading-relaxed">{a.desc}</Card>
      </Section>

      <Section title="Under the hood">
        <Group>
          <Row onClick={() => setPanel("who")} icon={<Icon><IdCard /></Icon>} title="Who it is" sub="Persona, goal, and what it may and may not do" />
          <Row onClick={() => setPanel("tools")} icon={<Icon><Wrench /></Icon>} title="Tools" sub={`${a.tools.filter((t) => t[3]).length} on`} />
          <Row onClick={() => setPanel("how")} icon={<Icon><Route /></Icon>} title="How it runs" sub="Step by step, hours, and what happens when it can't finish" />
          <Row href={`/activity?agent=${encodeURIComponent(a.name)}`} icon={<Icon><History /></Icon>} title="Activity" sub="Every email and call it handled" />
        </Group>
      </Section>

      {USED[a.id].length > 0 && (
        <Section title="Used in workflows">
          <Group>
            {USED[a.id].map((u) => {
              const w = WORKFLOWS.find((x) => x.name === u.name)
              return <Row key={u.name} href={w ? `/automate/workflows/${w.id}` : "/automate?view=workflows"} icon={<Icon><WorkflowIcon /></Icon>} title={u.name} sub={u.sub} />
            })}
          </Group>
        </Section>
      )}

      <Sheet open={panel !== null} onOpenChange={(o) => !o && setPanel(null)}>
        <SheetContent className="flex w-full flex-col gap-0 overflow-y-auto p-0 sm:max-w-lg">
          {panel === "who" && (
            <>
              <Head title="Who it is" sub={a.desc} />
              <dl className="divide-y divide-border">
                {[
                  ["Who it is", a.who],
                  ["Goal", a.goal],
                  ["It may", a.may],
                  ["It may not", a.mayNot],
                  ...(a.greeting ? [["Greeting", a.greeting]] : []),
                  ...(a.voice ? [["Voice", a.voice]] : []),
                  ["Language", a.language2 && !a.language2.startsWith("None") ? `${a.language}, ${a.language2}` : a.language],
                  ["Time zone", a.tz],
                  ["Team", a.team],
                ].map(([k, v]) => (
                  <div key={k} className="px-6 py-4">
                    <dt className="text-[13px] font-semibold text-muted-foreground">{k}</dt>
                    <dd className="mt-1 text-[15px] leading-relaxed">{v}</dd>
                  </div>
                ))}
              </dl>
            </>
          )}
          {panel === "tools" && (
            <>
              <Head title="Tools" sub="What it can use. Turn off anything you don't want it to touch." />
              <ul className="divide-y divide-border">
                {a.tools.map(([name, desc, , enabled]) => (
                  <li key={name} className="flex items-start gap-4 px-6 py-4">
                    <div className="flex-1">
                      <div className="text-[15px] font-medium">{name}</div>
                      <div className="mt-0.5 text-[13px] text-muted-foreground">{desc}</div>
                    </div>
                    <Switch defaultChecked={enabled} aria-label={name} />
                  </li>
                ))}
                {!a.tools.length && <li className="px-6 py-4 text-[15px] text-muted-foreground">No tools yet.</li>}
              </ul>
            </>
          )}
          {panel === "how" && (
            <>
              <Head title="How it runs" sub="What happens, in order, every time." />
              <div className="p-6">
                <Steps steps={FLOWS[a.id].map((s) => ({ title: s.title, sub: s.sub, tag: s.kind === "Agent" ? undefined : s.kind }))} />
              </div>
              <dl className="divide-y divide-border border-t border-border">
                {RUNSET[a.id].map((r) => (
                  <div key={r.label} className="px-6 py-4">
                    <dt className="text-[13px] font-semibold text-muted-foreground">{r.label}</dt>
                    <dd className="mt-1 text-[15px]">{r.value}</dd>
                  </div>
                ))}
              </dl>
              {isOp && (
                <div className="border-t border-border p-6">
                  <div className="mb-3 text-[13px] font-semibold text-muted-foreground">Kinds of email by step</div>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {STAGES.map((s) => (
                      <div key={s} className="rounded-xl bg-muted p-3">
                        <div className="text-[20px] font-semibold">{REQUEST_TYPES.filter((t) => t.stage === s).length}</div>
                        <div className="text-[11px] text-muted-foreground">{STAGE_INFO[s].label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}

function Head({ title, sub }: { title: string; sub: string }) {
  return (
    <SheetHeader className="border-b border-border p-6">
      <SheetTitle className="text-[22px] font-semibold tracking-tight">{title}</SheetTitle>
      <SheetDescription className="text-[15px]">{sub}</SheetDescription>
    </SheetHeader>
  )
}
