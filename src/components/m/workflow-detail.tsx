"use client"

import Link from "next/link"
import { useState } from "react"
import { AlertCircle, Workflow as WorkflowIcon } from "lucide-react"
import { toast } from "sonner"

import { BackLink } from "@/components/m/automate"
import { Card, Details, Dot, Group, Icon, Row, Section, Steps, btn } from "@/components/m/ui"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { RUNS, SETTINGS, type Run } from "@/lib/moneiva/automations-data"
import type { Workflow } from "@/lib/minimal"

const TONE = { red: "bad", amber: "warn", green: "ok", gray: "off", blue: "blue" } as const

export function WorkflowDetail({ w }: { w: Workflow }) {
  const [on, setOn] = useState(w.status === "live")
  const [run, setRun] = useState<Run | null>(null)
  const rich = w.id === "osd"
  const failed = w.last.startsWith("Couldn't")

  return (
    <>
      <BackLink href="/automate?view=workflows" label="Workflows" />

      <div className="mb-10 flex flex-wrap items-center gap-5">
        <span className="grid size-16 place-items-center rounded-[18px] bg-card shadow-sm [&_svg]:size-7">
          <WorkflowIcon />
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="text-[34px] leading-tight font-bold tracking-tight">{w.name}</h1>
          <p className="text-[15px] text-muted-foreground">{w.agents === "No agent" ? "Runs with no agent" : `Uses ${w.agents}`}</p>
        </div>
        <Link href={`/automate/workflows/${w.id}/edit`} className={btn.secondary}>
          Edit
        </Link>
        <label className="flex items-center gap-3 text-[15px] font-medium">
          {on ? "On" : "Off"}
          <Switch
            checked={on}
            onCheckedChange={(v) => {
              setOn(v)
              toast(v ? `${w.name} is on` : `${w.name} is off`)
            }}
          />
        </label>
      </div>

      <p className="mb-10 max-w-2xl text-[22px] leading-snug font-medium tracking-tight">{w.sentence}</p>

      {failed && (
        <Card className="mb-10 flex items-start gap-4 p-5 ring-1 ring-destructive/30 sm:p-6">
          <Icon tone="red">
            <AlertCircle />
          </Icon>
          <div className="flex-1">
            <div className="text-[17px] font-semibold">The last run couldn&apos;t finish</div>
            <p className="mt-1 text-[15px] text-muted-foreground">OS&amp;D check calls can&apos;t place calls. Fix the agent and the report runs again.</p>
            <Link href="/automate/agents/osd" className={cn(btn.primary, "mt-4")}>
              Fix the agent
            </Link>
          </div>
        </Card>
      )}

      <Section
        title="How it works"
        action={
          <Link href={`/automate/workflows/${w.id}/edit`} className={btn.plain}>
            Edit on canvas
          </Link>
        }
      >
        <Card className="p-6 sm:p-8">
          <Steps steps={w.steps.map((s) => ({ title: s.title, sub: s.sub, tag: s.agent }))} />
        </Card>
      </Section>

      <Section title="Recent runs">
        {rich ? (
          <Group>
            {RUNS.map((r) => (
              <Row
                key={r.id}
                onClick={() => setRun(r)}
                title={r.report}
                sub={
                  <span className="inline-flex items-center gap-1.5">
                    <Dot tone={TONE[r.tone]} />
                    {r.result} · {r.started}
                  </span>
                }
              />
            ))}
          </Group>
        ) : (
          <Group>
            <Row title={w.last === "Never" ? "No runs yet" : `Last run: ${w.last}`} sub={w.last === "Never" ? "Turn it on to start." : "Finished with no problems."} />
          </Group>
        )}
      </Section>

      {rich && (
        <Details label="Show settings" className="px-1">
          <div className="space-y-6">
            {SETTINGS.map((s) => (
              <div key={s.title}>
                <div className="mb-2 px-1 text-[13px] font-semibold text-muted-foreground">{s.title}</div>
                <Group>
                  {s.fields.map((f) => (
                    <Row key={f.label} title={f.label} sub={f.value} />
                  ))}
                </Group>
              </div>
            ))}
          </div>
        </Details>
      )}

      <Sheet open={!!run} onOpenChange={(o) => !o && setRun(null)}>
        <SheetContent className="flex w-full flex-col gap-0 overflow-y-auto p-0 sm:max-w-lg">
          {run && (
            <>
              <SheetHeader className="border-b border-border p-6">
                <SheetTitle className="text-[22px] font-semibold tracking-tight">{run.report}</SheetTitle>
                <SheetDescription className="text-[15px]">
                  {run.result} · started {run.started} · {run.took}
                </SheetDescription>
              </SheetHeader>
              {run.note && (
                <div className="border-b border-border p-6">
                  <div className="text-[15px] font-semibold">{run.noteTitle}</div>
                  <p className="mt-1 text-[15px] text-muted-foreground">{run.note}</p>
                </div>
              )}
              <div className="p-6">
                <Steps steps={run.steps.map((s) => ({ title: s.title, sub: [s.detail, s.time].filter(Boolean).join(" · "), state: s.state }))} />
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
