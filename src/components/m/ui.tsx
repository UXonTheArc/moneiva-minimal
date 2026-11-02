"use client"

import Link from "next/link"
import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { STAGES, type Stage } from "@/lib/moneiva/data"
import { STAGE_INFO } from "@/lib/minimal"

/* Buttons: one primary per screen, everything else quiet. */
export const btn = {
  primary:
    "inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-5 text-[15px] font-medium text-primary-foreground transition hover:brightness-110 active:scale-[0.98] disabled:opacity-40",
  secondary:
    "inline-flex h-10 items-center justify-center gap-2 rounded-full bg-secondary px-5 text-[15px] font-medium text-secondary-foreground transition hover:brightness-95 active:scale-[0.98] dark:hover:brightness-125",
  plain: "inline-flex items-center gap-1 text-[15px] font-medium text-primary hover:underline underline-offset-4",
  large:
    "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 text-[17px] font-medium text-primary-foreground transition hover:brightness-110 active:scale-[0.98]",
}

export function PageTitle({ eyebrow, title, lead, action }: { eyebrow?: string; title: string; lead?: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow && <p className="mb-1 text-[13px] font-semibold tracking-wide text-muted-foreground uppercase">{eyebrow}</p>}
        <h1 className="text-[34px] leading-tight font-bold tracking-tight sm:text-[40px]">{title}</h1>
        {lead && <p className="mt-2 max-w-2xl text-[17px] leading-relaxed text-muted-foreground">{lead}</p>}
      </div>
      {action}
    </div>
  )
}

export function Section({ title, action, children, className }: { title?: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("mb-10", className)}>
      {(title || action) && (
        <div className="mb-3 flex items-baseline justify-between gap-4 px-1">
          {title && <h2 className="text-[20px] font-semibold tracking-tight">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  )
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("rounded-2xl bg-card shadow-[0_1px_2px_rgb(0_0_0/0.04)]", className)}>{children}</div>
}

/** A grouped list, like Settings on a phone. */
export function Group({ children, className }: { children: React.ReactNode; className?: string }) {
  return <Card className={cn("divide-y divide-border overflow-hidden", className)}>{children}</Card>
}

type RowProps = {
  icon?: React.ReactNode
  title: React.ReactNode
  sub?: React.ReactNode
  value?: React.ReactNode
  href?: string
  onClick?: () => void
  chevron?: boolean
  className?: string
}

export function Row({ icon, title, sub, value, href, onClick, chevron = !!(href || onClick), className }: RowProps) {
  const inner = (
    <>
      {icon}
      <div className="min-w-0 flex-1">
        <div className="truncate text-[15px] font-medium">{title}</div>
        {sub && <div className="mt-0.5 line-clamp-2 text-[13px] text-muted-foreground">{sub}</div>}
      </div>
      {value && <div className="shrink-0 text-right text-[13px] text-muted-foreground">{value}</div>}
      {chevron && <ChevronRight className="size-4 shrink-0 text-muted-foreground/50" />}
    </>
  )
  const cls = cn("flex min-h-14 w-full items-center gap-3 px-4 py-3 text-left", (href || onClick) && "transition-colors hover:bg-muted/60", className)
  if (href) return <Link href={href} className={cls}>{inner}</Link>
  if (onClick) return <button onClick={onClick} className={cls}>{inner}</button>
  return <div className={cls}>{inner}</div>
}

/** Small rounded square holding an icon. Gray by default; color only when it means something. */
export function Icon({ children, tone = "gray" }: { children: React.ReactNode; tone?: "gray" | "blue" | "red" | "amber" | "green" }) {
  const tones = {
    gray: "bg-secondary text-foreground/70",
    blue: "bg-primary/12 text-primary",
    red: "bg-destructive/12 text-destructive",
    amber: "bg-warn/12 text-warn",
    green: "bg-ok/12 text-ok",
  }
  return <span className={cn("grid size-9 shrink-0 place-items-center rounded-[10px] [&_svg]:size-[18px]", tones[tone])}>{children}</span>
}

export function Dot({ tone }: { tone: "ok" | "warn" | "bad" | "off" | "blue" }) {
  const c = { ok: "bg-ok", warn: "bg-warn", bad: "bg-destructive", off: "bg-muted-foreground/40", blue: "bg-primary" }[tone]
  return <span className={cn("inline-block size-2 shrink-0 rounded-full", c)} />
}

/** The four step journey: Learn, Shadow, Review, Autopilot. */
export function Journey({ stage, compact }: { stage: Stage; compact?: boolean }) {
  const at = STAGES.indexOf(stage)
  return (
    <div className={cn("w-full", compact ? "max-w-40" : "")}>
      <div className="flex gap-1">
        {STAGES.map((s, i) => (
          <span key={s} className={cn("h-1.5 flex-1 rounded-full", i <= at ? "bg-primary" : "bg-secondary")} />
        ))}
      </div>
      {!compact && (
        <div className="mt-2 grid grid-cols-4 gap-1 text-[12px]">
          {STAGES.map((s, i) => (
            <span key={s} className={cn(i === at ? "font-semibold text-foreground" : "text-muted-foreground")}>
              {STAGE_INFO[s].label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

/** "Show details": the way into everything under the hood. Closed by default. */
export function Details({ label = "Show details", children, className }: { label?: string; children: React.ReactNode; className?: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={className}>
      <button onClick={() => setOpen((o) => !o)} className="inline-flex items-center gap-1 text-[14px] font-medium text-primary">
        {open ? "Hide details" : label}
        <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="mt-4 animate-in fade-in-0 slide-in-from-top-1">{children}</div>}
    </div>
  )
}

/** A vertical list of steps, used for "how it works" and run history. */
export function Steps({ steps }: { steps: { title: string; sub?: string; tag?: string; state?: "done" | "fail" | "now" | "todo" }[] }) {
  return (
    <ol className="relative">
      {steps.map((s, i) => (
        <li key={i} className="relative flex gap-4 pb-5 last:pb-0">
          {i < steps.length - 1 && <span className="absolute top-6 bottom-0 left-[11px] w-px bg-border" />}
          <span
            className={cn(
              "relative z-10 mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-semibold",
              s.state === "fail" ? "bg-destructive text-white" : s.state === "now" ? "bg-warn text-white" : s.state === "todo" ? "bg-secondary text-muted-foreground" : "bg-foreground text-background"
            )}
          >
            {i + 1}
          </span>
          <div className="min-w-0">
            <div className="text-[15px] font-medium">
              {s.title}
              {s.tag && <span className="ml-2 rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">{s.tag}</span>}
            </div>
            {s.sub && <div className="mt-0.5 text-[13px] text-muted-foreground">{s.sub}</div>}
          </div>
        </li>
      ))}
    </ol>
  )
}

export function Empty({ icon, title, sub, children }: { icon: React.ReactNode; title: string; sub: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <div className="mb-5 grid size-16 place-items-center rounded-full bg-card text-primary shadow-sm [&_svg]:size-8">{icon}</div>
      <h2 className="text-[24px] font-semibold tracking-tight">{title}</h2>
      <p className="mt-2 max-w-md text-[15px] leading-relaxed text-muted-foreground">{sub}</p>
      {children && <div className="mt-7 flex flex-wrap justify-center gap-3">{children}</div>}
    </div>
  )
}

/** Segmented control, used instead of tabs. */
export function Segmented<T extends string>({ value, options, onChange }: { value: T; options: { value: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="inline-flex rounded-full bg-secondary/80 p-1">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn("h-8 rounded-full px-4 text-[13px] font-medium text-muted-foreground transition", value === o.value && "bg-card text-foreground shadow-sm")}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

/* Form controls: the same look in every sheet. */
export const inputCls =
  "mt-1 h-11 w-full rounded-xl border border-border bg-card px-3 text-[15px] outline-none focus:ring-4 focus:ring-primary/15"
export const areaCls =
  "mt-1 w-full resize-none rounded-xl border border-border bg-card p-3 text-[15px] leading-relaxed outline-none focus:ring-4 focus:ring-primary/15"

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[13px] font-semibold text-muted-foreground">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[12px] text-muted-foreground">{hint}</span>}
    </label>
  )
}

export function Select({ value, options, onChange }: { value: string; options: string[]; onChange?: (v: string) => void }) {
  return (
    <select defaultValue={value} onChange={(e) => onChange?.(e.target.value)} className={cn(inputCls, "appearance-none bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-9")}
      style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236e6e73' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")" }}
    >
      {[value, ...options.filter((o) => o !== value)].map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  )
}

/** The same footer on every editable sheet. */
export function SaveBar({ onSave }: { onSave: () => void }) {
  return (
    <div className="sticky bottom-0 mt-auto border-t border-border bg-background p-4">
      <button
        className={cn(btn.primary, "w-full")}
        onClick={() => {
          onSave()
          toast.success("Saved")
        }}
      >
        Save
      </button>
    </div>
  )
}

