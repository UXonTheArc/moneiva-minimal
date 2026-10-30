"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { ArrowRight, BookOpen, FileText, FileUp, GraduationCap, Loader, Mail, Scale, Search, Tags } from "lucide-react"
import { toast } from "sonner"

import { FactsSheet, type SheetFact } from "@/components/m/facts-sheet"
import { useDone } from "@/components/m/store"
import { Card, Empty, Group, Icon, Journey, PageTitle, Row, Section, btn } from "@/components/m/ui"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { DOCS, REQUEST_TYPES, RULES, STAGES } from "@/lib/moneiva/data"
import { FACT_COUNT, KNOWS, NEW_DOC, factsFrom } from "@/lib/moneiva/playbook-data"
import { EMAIL_SOURCE, RUNS } from "@/lib/moneiva/training-data"
import { STAGE_INFO, TEACH_ITEMS } from "@/lib/minimal"

const EMAIL = "Your email history"
type Phase = "ready" | "empty" | "reading"
type Open = { title: string; sub: string; facts: SheetFact[]; checkable?: boolean } | null

export function Teach({ initialPhase }: { initialPhase: Phase }) {
  const [phase, setPhase] = useState<Phase>(initialPhase)
  const [q, setQ] = useState("")
  const [open, setOpen] = useState<Open>(null)
  const [panel, setPanel] = useState<"rules" | "types" | "email" | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const isDone = useDone()
  const toCheck = TEACH_ITEMS.filter((t) => !isDone(t.kind === "new" ? t.item.id : t.thread.id)).length

  const all = useMemo(() => KNOWS.flatMap((g) => g.facts.map((f) => ({ ...f, group: g.name }))), [])
  const hits = q.trim() ? all.filter((f) => f.text.toLowerCase().includes(q.trim().toLowerCase())) : []

  const newDocFacts = NEW_DOC.facts.map((f) => ({ ...f, src: NEW_DOC.name }))
  const openDoc = (name: string) => {
    const facts = name === NEW_DOC.name ? newDocFacts : factsFrom(name)
    setOpen({ title: name, sub: `Learned ${facts.length} facts from this ${name === EMAIL ? "email" : "document"}. Mark anything wrong and it will be removed.`, facts })
  }

  function upload() {
    setUploading(true)
    setTimeout(() => {
      setUploading(false)
      setUploaded(true)
      toast.success(`Learned ${NEW_DOC.facts.length} facts from ${NEW_DOC.name}`, {
        action: { label: "Review", onClick: () => openDoc(NEW_DOC.name) },
        duration: 8000,
      })
    }, 2500)
  }

  if (phase === "empty") {
    return (
      <>
        <PageTitle title="Teach" />
        <Card>
          <Empty
            icon={<GraduationCap />}
            title="Teach it how your team works."
            sub="Connect your team's mailbox. It reads your past email to learn what your team does for each kind of request. Nothing is sent."
          >
            <button className={btn.large} onClick={() => setPhase("reading")}>
              Connect email
            </button>
            <button className={cn(btn.secondary, "h-12 px-6 text-[17px]")} onClick={upload}>
              Upload a document
            </button>
          </Empty>
        </Card>
      </>
    )
  }

  if (phase === "reading") {
    const pct = Math.round((EMAIL_SOURCE.readingDone / EMAIL_SOURCE.readingTotal) * 100)
    return (
      <>
        <PageTitle title="Teach" />
        <Card className="flex flex-col items-center px-6 py-14 text-center">
          <div className="relative mb-6 size-28">
            <svg viewBox="0 0 36 36" className="size-28 -rotate-90">
              <circle cx="18" cy="18" r="16" fill="none" strokeWidth="2.5" className="stroke-secondary" />
              <circle cx="18" cy="18" r="16" fill="none" strokeWidth="2.5" strokeLinecap="round" className="stroke-primary" strokeDasharray={`${pct} 100`} pathLength={100} />
            </svg>
            <span className="absolute inset-0 grid place-items-center text-[24px] font-semibold">{pct}%</span>
          </div>
          <h2 className="text-[24px] font-semibold tracking-tight">Reading your email history</h2>
          <p className="mt-2 max-w-md text-[15px] text-muted-foreground">
            {EMAIL_SOURCE.readingDone} of {EMAIL_SOURCE.readingTotal} threads from {EMAIL_SOURCE.mailbox}. You can leave this page. You&apos;ll find things to check here when it&apos;s done.
          </p>
          <button className={cn(btn.secondary, "mt-7")} onClick={() => setPhase("ready")}>
            Skip ahead (mockup)
          </button>
        </Card>
      </>
    )
  }

  return (
    <>
      <PageTitle title="Teach" lead="Everything your agents know, and where they learned it." />

      <Card className="mb-12 flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
        <div className="flex-1">
          <div className="text-[64px] leading-none font-bold tracking-tight">{toCheck}</div>
          <p className="mt-2 text-[17px] text-muted-foreground">
            {toCheck === 1 ? "thing" : "things"} to check from email it read or watched. Each answer means it asks you less.
          </p>
        </div>
        {toCheck > 0 && (
          <Link href="/teach/check" className={btn.large}>
            Start
            <ArrowRight className="size-5" />
          </Link>
        )}
      </Card>

      <Section title="Add to what it knows">
        <div className="grid gap-3 sm:grid-cols-2">
          <button onClick={() => setPanel("email")} className="text-left">
            <Card className="flex h-full items-start gap-4 p-5 transition hover:shadow-md">
              <Icon tone="blue">
                <Mail />
              </Icon>
              <div>
                <div className="text-[17px] font-semibold">Email history</div>
                <div className="mt-1 text-[14px] text-muted-foreground">Import past threads from {EMAIL_SOURCE.mailbox}. 199 read so far.</div>
              </div>
            </Card>
          </button>
          <button onClick={upload} disabled={uploading} className="text-left">
            <Card className="flex h-full items-start gap-4 p-5 transition hover:shadow-md">
              <Icon tone="blue">{uploading ? <Loader className="animate-spin" /> : <FileUp />}</Icon>
              <div>
                <div className="text-[17px] font-semibold">{uploading ? `Reading ${NEW_DOC.name}` : "Upload a document"}</div>
                <div className="mt-1 text-[14px] text-muted-foreground">
                  {uploading ? "This takes a moment." : "Guides, rate sheets, dock hours. It lists every fact it learns so you can check them."}
                </div>
              </div>
            </Card>
          </button>
        </div>
      </Section>

      <Section title="What it knows">
        <div className="relative mb-3">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${FACT_COUNT} facts`}
            className="h-11 w-full rounded-xl bg-card pr-4 pl-10 text-[15px] shadow-[0_1px_2px_rgb(0_0_0/0.04)] outline-none placeholder:text-muted-foreground focus:ring-4 focus:ring-primary/15"
          />
        </div>
        {q.trim() ? (
          <Group>
            {hits.length ? (
              hits.slice(0, 12).map((f, i) => <Row key={i} title={<span className="whitespace-normal">{f.text}</span>} sub={`${f.group} · ${f.src}`} />)
            ) : (
              <Row title="Nothing found" sub="Try another word, or teach it by uploading a document." />
            )}
          </Group>
        ) : (
          <Group>
            {KNOWS.map((g) => (
              <Row
                key={g.name}
                onClick={() => setOpen({ title: g.name, sub: `${g.facts.length} facts`, facts: g.facts.map((f) => ({ text: f.text, src: f.src })) })}
                icon={
                  <Icon>
                    <BookOpen />
                  </Icon>
                }
                title={g.name}
                value={`${g.facts.length}`}
              />
            ))}
            <Row
              onClick={() => setPanel("rules")}
              icon={
                <Icon>
                  <Scale />
                </Icon>
              }
              title="Rules you set"
              sub="Things it must always or never do"
              value={`${RULES.filter((r) => r.active).length}`}
            />
            <Row
              onClick={() => setPanel("types")}
              icon={
                <Icon>
                  <Tags />
                </Icon>
              }
              title="Kinds of email"
              sub="Each one moves from Learning to Autopilot on its own"
              value={`${REQUEST_TYPES.length}`}
            />
          </Group>
        )}
      </Section>

      <Section title="Where it learned it">
        <Group>
          <Row
            onClick={() => openDoc(EMAIL)}
            icon={
              <Icon>
                <Mail />
              </Icon>
            }
            title="Email history"
            sub={EMAIL_SOURCE.mailbox}
            value={`${factsFrom(EMAIL).length} facts`}
          />
          {uploaded && (
            <Row
              onClick={() => openDoc(NEW_DOC.name)}
              icon={
                <Icon tone="blue">
                  <FileText />
                </Icon>
              }
              title={NEW_DOC.name}
              sub="Just now"
              value={`${NEW_DOC.facts.length} facts`}
            />
          )}
          {DOCS.map((d) => (
            <Row
              key={d.name}
              onClick={d.state === "Read" ? () => openDoc(d.name) : undefined}
              icon={<Icon>{d.state === "Read" ? <FileText /> : <Loader className="animate-spin" />}</Icon>}
              title={d.name}
              sub={d.state === "Read" ? `${d.on} by ${d.by}` : "Reading"}
              value={d.state === "Read" ? `${factsFrom(d.name).length} facts` : undefined}
            />
          ))}
        </Group>
      </Section>

      {open && (
        <FactsSheet key={open.title} open onOpenChange={(o) => !o && setOpen(null)} title={open.title} sub={open.sub} facts={open.facts} checkable={open.checkable} />
      )}

      <Sheet open={panel !== null} onOpenChange={(o) => !o && setPanel(null)}>
        <SheetContent className="flex w-full flex-col gap-0 overflow-y-auto p-0 sm:max-w-lg">
          {panel === "rules" && <RulesPanel />}
          {panel === "types" && <TypesPanel />}
          {panel === "email" && <EmailPanel onImport={() => setPanel(null)} />}
        </SheetContent>
      </Sheet>
    </>
  )
}

function PanelHead({ title, sub }: { title: string; sub: string }) {
  return (
    <SheetHeader className="border-b border-border p-6">
      <SheetTitle className="text-[22px] font-semibold tracking-tight">{title}</SheetTitle>
      <SheetDescription className="text-[15px]">{sub}</SheetDescription>
    </SheetHeader>
  )
}

function RulesPanel() {
  return (
    <>
      <PanelHead title="Rules you set" sub="Rules always win over what it learned. Most come from edits you made in Review." />
      <ul className="divide-y divide-border">
        {RULES.map((r, i) => (
          <li key={i} className="flex items-start gap-4 px-6 py-4">
            <div className="min-w-0 flex-1">
              <p className="text-[15px] leading-relaxed">{r.text}</p>
              <p className="mt-1 text-[12px] text-muted-foreground">
                {r.requestType} · {r.by}, {r.on}
              </p>
            </div>
            <Switch defaultChecked={r.active} aria-label="Rule on" className="mt-1" />
          </li>
        ))}
      </ul>
    </>
  )
}

function TypesPanel() {
  return (
    <>
      <PanelHead title="Kinds of email" sub="Each kind of email moves through four steps. It moves up when it keeps matching your team, and you always approve the move." />
      {STAGES.map((s) => {
        const types = REQUEST_TYPES.filter((t) => t.stage === s)
        return (
          <div key={s} className="border-b border-border px-6 py-5">
            <div className="mb-1 flex items-baseline justify-between">
              <h3 className="text-[17px] font-semibold">{STAGE_INFO[s].label}</h3>
              <span className="text-[13px] text-muted-foreground">{types.length}</span>
            </div>
            <p className="mb-3 text-[13px] text-muted-foreground">{STAGE_INFO[s].sub}</p>
            <Journey stage={s} compact />
            <ul className="mt-3 space-y-2">
              {types.map((t) => (
                <li key={t.name} className="flex justify-between gap-3 text-[14px]">
                  <span>{t.name}</span>
                  <span className="shrink-0 text-muted-foreground">{t.of ? `${t.matched} of ${t.of} right` : ""}</span>
                </li>
              ))}
              {!types.length && <li className="text-[14px] text-muted-foreground">None yet</li>}
            </ul>
          </div>
        )
      })}
    </>
  )
}

function EmailPanel({ onImport }: { onImport: () => void }) {
  const [months, setMonths] = useState("3")
  return (
    <>
      <PanelHead title="Email history" sub={`Connected to ${EMAIL_SOURCE.mailbox}. It reads past threads to learn what your team does. Nothing is sent.`} />
      <div className="p-6">
        <div className="mb-3 text-[15px] font-medium">Import more</div>
        <div className="mb-5 inline-flex rounded-full bg-secondary p-1">
          {["1", "3", "6", "12"].map((m) => (
            <button key={m} onClick={() => setMonths(m)} className={cn("h-8 rounded-full px-4 text-[13px] font-medium text-muted-foreground", months === m && "bg-card text-foreground shadow-sm")}>
              {m} {m === "1" ? "month" : "months"}
            </button>
          ))}
        </div>
        <button
          className={cn(btn.primary, "w-full")}
          onClick={() => {
            onImport()
            toast(`Importing the last ${months} ${months === "1" ? "month" : "months"}. New things to check will show up in Teach.`)
          }}
        >
          Import
        </button>
      </div>
      <div className="border-t border-border px-6 py-5">
        <div className="mb-2 text-[13px] font-semibold text-muted-foreground">Past imports</div>
        <ul className="space-y-3">
          {RUNS.map((r) => (
            <li key={r.id} className="text-[14px]">
              <div className="font-medium">{r.label}</div>
              <div className="text-muted-foreground">{r.sub}</div>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
