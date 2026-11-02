"use client"

import { Check, ChevronDown } from "lucide-react"

import { Dot } from "@/components/m/ui"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export type RunStatus = "live" | "test" | "paused" | "off"
export const STATUS_TONE = { live: "ok", test: "blue", paused: "warn", off: "off" } as const

/** One status control for agents and workflows: Live, Test only, Paused, Off. */
export function StatusMenu({
  value,
  options,
  onChange,
}: {
  value: RunStatus
  options: readonly { value: RunStatus; label: string; sub: string }[]
  onChange: (v: RunStatus) => void
}) {
  const current = options.find((o) => o.value === value) ?? options[0]
  return (
    <Popover>
      <PopoverTrigger className="inline-flex h-10 items-center gap-2 rounded-full bg-card px-4 text-[15px] font-medium shadow-sm outline-none hover:shadow-md focus-visible:ring-4 focus-visible:ring-primary/30">
        <Dot tone={STATUS_TONE[current.value]} />
        {current.label}
        <ChevronDown className="size-4 text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 rounded-2xl p-1.5">
        {options.map((o) => (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={cn("flex w-full items-start gap-3 rounded-xl p-3 text-left hover:bg-muted", o.value === value && "bg-muted")}
          >
            <span className="mt-1.5">
              <Dot tone={STATUS_TONE[o.value]} />
            </span>
            <span className="flex-1">
              <span className="block text-[15px] font-medium">{o.label}</span>
              <span className="block text-[13px] text-muted-foreground">{o.sub}</span>
            </span>
            {o.value === value && <Check className="mt-1 size-4 text-primary" />}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  )
}
