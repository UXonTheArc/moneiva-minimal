"use client"

import Link from "next/link"
import { useState } from "react"
import { Check, ChevronLeft } from "lucide-react"
import { toast } from "sonner"

import { markDone, undoDone, useDone } from "@/components/m/store"
import { Card, Details, Empty, btn } from "@/components/m/ui"
import { cn } from "@/lib/utils"
import type { NewTypeItem } from "@/lib/moneiva/inbox-data"
import type { Thread } from "@/lib/moneiva/training-data"
import { TEACH_ITEMS, type TeachItem } from "@/lib/minimal"

const idOf = (t: TeachItem) => (t.kind === "new" ? t.item.id : t.thread.id)

export function TeachCheck() {
  const isDone = useDone()
  const left = TEACH_ITEMS.filter((t) => !isDone(idOf(t)))
  const current = left[0]

  function finish(t: TeachItem, msg: string) {
    const id = idOf(t)
    markDone(id)
    toast(msg, { action: { label: "Undo", onClick: () => undoDone(id) } })
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/teach" className="mb-6 inline-flex items-center gap-1 text-[15px] font-medium text-primary">
        <ChevronLeft className="size-4" />
        Teach
      </Link>
      {!current ? (
        <Empty icon={<Check />} title="That's everything." sub="Thanks. It will use what you taught it from the next email on.">
          <Link href="/" className={btn.primary}>Back to Today</Link>
          <Link href="/teach" className={btn.secondary}>See what it knows</Link>
        </Empty>
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between px-1 text-[13px] text-muted-foreground">
            <span>{left.length} left</span>
            <div className="h-1 w-32 overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${((TEACH_ITEMS.length - left.length) / TEACH_ITEMS.length) * 100}%` }} />
            </div>
          </div>
          {current.kind === "new" ? (
            <NewKind key={current.item.id} item={current.item} onDone={(m) => finish(current, m)} />
          ) : (
            <ThreadCard key={current.thread.id} t={current.thread} onDone={(m) => finish(current, m)} />
          )}
        </>
      )}
    </div>
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="mb-2 text-[13px] font-semibold tracking-wide text-primary uppercase">{children}</p>
}

function NewKind({ item, onDone }: { item: NewTypeItem; onDone: (msg: string) => void }) {
  const [name, setName] = useState(item.name)
  return (
    <Card className="animate-in p-6 fade-in-0 slide-in-from-right-4 sm:p-8">
      <Eyebrow>New kind of email</Eyebrow>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        aria-label="Name"
        className="w-full rounded-lg bg-transparent text-[24px] font-semibold tracking-tight outline-none focus:bg-muted focus:px-2"
      />
      <p className="mt-2 text-[17px] leading-relaxed text-muted-foreground">{item.desc}</p>
      <div className="mt-6 rounded-xl bg-muted p-4">
        <div className="text-[13px] font-semibold text-muted-foreground">What it will do</div>
        <div className="mt-1 text-[15px]">{item.would}</div>
      </div>
      <p className="mt-4 text-[13px] text-muted-foreground">{item.found}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button className={btn.primary} onClick={() => onDone(`Added "${name}". It starts in Learning.`)}>
          Add it
        </button>
        <button className={btn.secondary} onClick={() => onDone("Got it. It will treat these like the closest kind it knows.")}>
          Not a new kind
        </button>
      </div>
      <div className="mt-8 border-t border-border pt-6">
        <Details label={`See the ${item.emails.length} emails`}>
          <Emails list={item.emails.map((e) => ({ who: e.who, time: e.time, body: e.body, title: e.subject }))} />
        </Details>
      </div>
    </Card>
  )
}

function ThreadCard({ t, onDone }: { t: Thread; onDone: (msg: string) => void }) {
  const [note, setNote] = useState(false)
  const [rule, setRule] = useState(true)
  const live = t.tab === "shadow"
  return (
    <Card className="animate-in p-6 fade-in-0 slide-in-from-right-4 sm:p-8">
      <Eyebrow>{live ? `Watched live · ${t.date}` : `From past email · ${t.date}`}</Eyebrow>
      <h2 className="text-[24px] leading-snug font-semibold tracking-tight">{t.subject}</h2>
      <p className="mt-1 text-[15px] text-muted-foreground">
        {t.from} · {t.kind === "new" ? "A kind of email it hasn't seen" : t.type}
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-muted p-4">
          <div className="text-[13px] font-semibold text-muted-foreground">{live ? "It guessed" : "It would have"}</div>
          <div className="mt-1 text-[15px]">{t.would}</div>
        </div>
        <div className="rounded-xl bg-primary/8 p-4 ring-1 ring-primary/20">
          <div className="text-[13px] font-semibold text-primary">Your team</div>
          <div className="mt-1 text-[15px]">{t.did}</div>
        </div>
      </div>

      <p className="mt-6 text-[17px] font-medium">Should it do what your team did?</p>

      {note && (
        <div className="mt-4">
          <textarea
            defaultValue={t.fix}
            rows={3}
            autoFocus
            aria-label="Tell it what to do"
            className="w-full resize-none rounded-xl border border-primary/40 bg-card p-4 text-[15px] leading-relaxed outline-none focus:ring-4 focus:ring-primary/15"
          />
          <label className="mt-3 flex cursor-pointer items-start gap-3 text-[15px]">
            <input type="checkbox" checked={rule} onChange={(e) => setRule(e.target.checked)} className="mt-1 size-4 accent-[var(--primary)]" />
            <span>
              Make it a rule
              <span className="mt-0.5 block text-[13px] text-muted-foreground">
                When {t.when}, {t.then}
              </span>
            </span>
          </label>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {note ? (
          <>
            <button className={btn.primary} onClick={() => onDone(rule ? "Saved, and added as a rule." : "Saved. It will learn from this.")}>
              Save
            </button>
            <button className={btn.secondary} onClick={() => setNote(false)}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <button className={btn.primary} onClick={() => onDone("Got it. It will do what your team did.")}>
              Yes, learn this
            </button>
            <button className={btn.secondary} onClick={() => setNote(true)}>
              Explain it
            </button>
            <button className="ml-auto text-[15px] font-medium text-muted-foreground hover:text-foreground" onClick={() => onDone("Skipped. It won't learn from this one.")}>
              Skip
            </button>
          </>
        )}
      </div>

      <div className="mt-8 border-t border-border pt-6">
        <Details label="See the whole thread">
          <Emails list={t.emails.map((e) => ({ who: e.who, time: e.time, body: e.body, op: e.op, team: e.isTeam }))} />
          {t.learned.length > 0 && (
            <>
              <div className="mt-6 mb-2 text-[13px] font-semibold text-muted-foreground">It will learn</div>
              <ul className="space-y-2">
                {t.learned.map((l, i) => (
                  <li key={i} className="text-[14px]">
                    <span className="text-muted-foreground">{l.label}: </span>
                    {l.text}
                  </li>
                ))}
              </ul>
            </>
          )}
        </Details>
      </div>
    </Card>
  )
}

function Emails({ list }: { list: { who: string; time: string; body: string; title?: string; op?: string; team?: boolean }[] }) {
  return (
    <div className="space-y-3">
      {list.map((e, i) => (
        <div key={i} className={cn("rounded-xl border border-border p-4", e.team && "border-primary/30")}>
          <div className="mb-1 flex justify-between gap-3 text-[13px] text-muted-foreground">
            <span className="font-medium text-foreground">
              {e.who}
              {e.team && <span className="ml-2 text-primary">Your team</span>}
            </span>
            <span>{e.time}</span>
          </div>
          {e.title && <div className="text-[14px] font-medium">{e.title}</div>}
          <div className="text-[14px] leading-relaxed whitespace-pre-wrap">{e.body}</div>
          {e.op && <div className="mt-2 text-[13px] text-muted-foreground">It would have: {e.op}</div>}
        </div>
      ))}
    </div>
  )
}
