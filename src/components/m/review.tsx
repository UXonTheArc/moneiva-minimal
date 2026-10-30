"use client"

import Link from "next/link"
import { useState } from "react"
import { Check, Mail, Paperclip, Phone } from "lucide-react"
import { toast } from "sonner"

import { markDone, undoDone, useDone } from "@/components/m/store"
import { Card, Details, Empty, Group, Icon, PageTitle, Row, Segmented, Steps, btn } from "@/components/m/ui"
import { cn } from "@/lib/utils"
import { DONT_SEND_REASONS, type CallItem, type ReplyItem } from "@/lib/moneiva/inbox-data"
import { REVIEW_ITEMS } from "@/lib/minimal"

type Item = ReplyItem | CallItem
type Mode = "view" | "edit" | "skip"

export function Review({ initialId }: { initialId?: string }) {
  const isDone = useDone()
  const left = REVIEW_ITEMS.filter((i) => !isDone(i.id))
  const [view, setView] = useState<"one" | "list">("one")
  const [pick, setPick] = useState<string | undefined>(initialId)
  const current = left.find((i) => i.id === pick) ?? left[0]

  function finish(item: Item, message: string) {
    markDone(item.id)
    setPick(undefined)
    toast(message, { action: { label: "Undo", onClick: () => undoDone(item.id) } })
  }

  if (!current) {
    return (
      <Empty icon={<Check />} title="All caught up." sub="Every reply and call has been handled. New ones show up here as they come in.">
        <Link href="/" className={btn.primary}>Back to Today</Link>
        <Link href="/activity" className={btn.secondary}>See what was sent</Link>
      </Empty>
    )
  }

  const pos = left.indexOf(current) + 1

  return (
    <>
      <PageTitle
        title="Review"
        lead="Your agents did the work. Check it, then send."
        action={
          <Segmented
            value={view}
            onChange={setView}
            options={[
              { value: "one", label: "One at a time" },
              { value: "list", label: `All ${left.length}` },
            ]}
          />
        }
      />

      {view === "list" ? (
        <Group>
          {left.map((i) => (
            <Row
              key={i.id}
              onClick={() => {
                setPick(i.id)
                setView("one")
              }}
              icon={<Icon>{i.kind === "call" ? <Phone /> : <Mail />}</Icon>}
              title={i.subject}
              sub={`${i.from}, ${i.company} · ${i.line}`}
              value={`${i.wait} ago`}
            />
          ))}
        </Group>
      ) : (
        <div className="mx-auto max-w-2xl">
          <div className="mb-4 flex items-center justify-between px-1 text-[13px] text-muted-foreground">
            <span>
              {pos} of {left.length}
            </span>
            <div className="flex gap-1.5">
              {left.map((i) => (
                <button
                  key={i.id}
                  aria-label={i.subject}
                  onClick={() => setPick(i.id)}
                  className={cn("size-2 rounded-full transition", i.id === current.id ? "w-5 bg-foreground" : "bg-foreground/20")}
                />
              ))}
            </div>
          </div>
          <ItemCard key={current.id} item={current} onFinish={finish} />
        </div>
      )}
    </>
  )
}

function ItemCard({ item, onFinish }: { item: Item; onFinish: (i: Item, msg: string) => void }) {
  const [mode, setMode] = useState<Mode>("view")
  const [text, setText] = useState(item.kind === "reply" ? item.reply : "")
  const [remember, setRemember] = useState(true)
  const [reason, setReason] = useState<string>("")
  const first = item.from.split(" ")[0]
  const type = item.type ?? item.guess
  const rule = `For ${item.ruleType}: when ${item.ruleWhen}, ${item.ruleThen}.`

  return (
    <Card className="animate-in p-6 fade-in-0 slide-in-from-right-4 sm:p-8">
      {/* Who and what */}
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-full bg-secondary text-[13px] font-semibold">
          {item.from
            .split(" ")
            .map((p) => p[0])
            .join("")}
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[15px] font-semibold">
            {item.from} <span className="font-normal text-muted-foreground">· {item.company}</span>
          </div>
          <div className="text-[13px] text-muted-foreground">
            {item.kind === "call" ? "Phone call" : "Email"} · {item.when}
          </div>
        </div>
      </div>

      <h2 className="mt-6 text-[24px] leading-snug font-semibold tracking-tight">{item.subject}</h2>
      <p className="mt-2 text-[17px] leading-relaxed text-muted-foreground">{item.asked}</p>
      {type && (
        <p className="mt-3 text-[13px] text-muted-foreground">
          {item.type ? type : `Looks like ${type}. Not sure yet, so it asked you.`}
        </p>
      )}

      {/* What the agent wants to do */}
      <div className="mt-6">
        <div className="mb-2 text-[13px] font-semibold text-muted-foreground">
          {item.kind === "call" ? "Next step" : mode === "edit" ? "Edit the reply" : "Suggested reply"}
        </div>
        {item.kind === "call" ? (
          <div className="rounded-xl bg-muted p-4">
            <div className="text-[15px] font-semibold">{item.stepTitle}</div>
            <div className="mt-1 text-[15px] text-muted-foreground">{item.step}</div>
          </div>
        ) : mode === "edit" ? (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={9}
            autoFocus
            className="w-full resize-none rounded-xl border border-primary/40 bg-card p-4 text-[15px] leading-relaxed outline-none focus:ring-4 focus:ring-primary/15"
          />
        ) : (
          <div className="rounded-xl bg-muted p-4 text-[15px] leading-relaxed whitespace-pre-wrap">{text}</div>
        )}
        {item.kind === "reply" && item.also && mode !== "skip" && (
          <p className="mt-3 text-[13px] text-muted-foreground">It will also: {item.also.charAt(0).toLowerCase() + item.also.slice(1)}</p>
        )}
      </div>

      {mode === "edit" && (
        <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl p-1 text-[15px]">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="mt-1 size-4 accent-[var(--primary)]" />
          <span>
            Remember this for next time
            <span className="mt-0.5 block text-[13px] text-muted-foreground">{rule}</span>
          </span>
        </label>
      )}

      {mode === "skip" && (
        <div className="mt-6">
          <div className="mb-3 text-[15px] font-medium">Why not?</div>
          <div className="flex flex-wrap gap-2">
            {DONT_SEND_REASONS.map((r) => (
              <button
                key={r}
                onClick={() => setReason(r)}
                className={cn(
                  "h-9 rounded-full border px-4 text-[14px] transition",
                  reason === r ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted"
                )}
              >
                {r}
              </button>
            ))}
          </div>
          {item.kind === "reply" && (
            <textarea
              defaultValue={item.instead}
              rows={2}
              className="mt-4 w-full resize-none rounded-xl border border-border bg-card p-3 text-[15px] outline-none focus:ring-4 focus:ring-primary/15"
              aria-label="What should it do instead?"
            />
          )}
        </div>
      )}

      {/* Actions: one obvious next step */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        {mode === "view" && item.kind === "reply" && (
          <>
            <button className={btn.primary} onClick={() => onFinish(item, `Sent to ${first}`)}>
              Send
            </button>
            <button className={btn.secondary} onClick={() => setMode("edit")}>
              Edit
            </button>
            <button className="ml-auto text-[15px] font-medium text-muted-foreground hover:text-foreground" onClick={() => setMode("skip")}>
              Don&apos;t send
            </button>
          </>
        )}
        {mode === "view" && item.kind === "call" && (
          <>
            <button className={btn.primary} onClick={() => onFinish(item, `Marked as done. ${first} has been called back.`)}>
              I called back
            </button>
            <a href={`tel:${item.addr}`} className={btn.secondary}>
              <Phone className="size-4" />
              Call {item.addr}
            </a>
          </>
        )}
        {mode === "edit" && (
          <>
            <button className={btn.primary} onClick={() => onFinish(item, remember ? `Sent to ${first}. It will remember this.` : `Sent to ${first}`)}>
              Send
            </button>
            <button className={btn.secondary} onClick={() => setMode("view")}>
              Cancel
            </button>
          </>
        )}
        {mode === "skip" && (
          <>
            <button className={btn.primary} disabled={!reason} onClick={() => onFinish(item, "Not sent. Thanks, it will learn from this.")}>
              Done
            </button>
            <button className={btn.secondary} onClick={() => setMode("view")}>
              Cancel
            </button>
          </>
        )}
      </div>

      {/* Under the hood */}
      <div className="mt-8 border-t border-border pt-6">
        <Details label={item.kind === "call" ? "How it got here" : "Why this reply"}>
          {item.kind === "reply" && <p className="mb-5 text-[15px] leading-relaxed">{item.why}</p>}
          {item.kind === "reply" && item.ruleUsed && (
            <p className="mb-5 rounded-xl bg-muted p-3 text-[13px]">
              <span className="font-semibold">Rule used: </span>
              {item.ruleUsed}
            </p>
          )}
          <div className="mb-2 text-[13px] font-semibold text-muted-foreground">What it checked</div>
          <Steps steps={item.checks.map((c) => ({ title: c.title, sub: c.detail }))} />
          <div className="mt-6 mb-2 text-[13px] font-semibold text-muted-foreground">{item.kind === "call" ? "The call" : "The email"}</div>
          <div className="space-y-3">
            {item.emails.map((e, i) => (
              <div key={i} className="rounded-xl border border-border p-4">
                <div className="mb-1 flex justify-between gap-3 text-[13px] text-muted-foreground">
                  <span className="font-medium text-foreground">{e.who}</span>
                  <span>{e.time}</span>
                </div>
                <div className="text-[14px] leading-relaxed whitespace-pre-wrap">{e.body}</div>
                {e.file && (
                  <div className="mt-2 inline-flex items-center gap-1 text-[13px] text-muted-foreground">
                    <Paperclip className="size-3.5" />
                    {e.file}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Details>
      </div>
    </Card>
  )
}
