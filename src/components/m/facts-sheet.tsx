"use client"

import { useState } from "react"
import { Check, Undo2, X } from "lucide-react"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { btn } from "@/components/m/ui"
import { cn } from "@/lib/utils"

export type SheetFact = { text: string; group?: string; src?: string }

/** A list of facts someone can check line by line: right, or remove. */
export function FactsSheet({
  open,
  onOpenChange,
  title,
  sub,
  facts,
  checkable = true,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  title: string
  sub: string
  facts: SheetFact[]
  checkable?: boolean
}) {
  const [state, setState] = useState<Record<number, "right" | "removed">>({})
  const set = (i: number, v?: "right" | "removed") => setState((s) => ({ ...s, [i]: v as "right" }))

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-lg">
        <SheetHeader className="border-b border-border p-6">
          <SheetTitle className="text-[22px] font-semibold tracking-tight">{title}</SheetTitle>
          <SheetDescription className="text-[15px]">{sub}</SheetDescription>
        </SheetHeader>
        <ul className="flex-1 divide-y divide-border overflow-y-auto">
          {facts.map((f, i) => {
            const st = state[i]
            return (
              <li key={i} className="flex items-start gap-3 px-6 py-4">
                <div className="min-w-0 flex-1">
                  <p className={cn("text-[15px] leading-relaxed", st === "removed" && "text-muted-foreground line-through")}>{f.text}</p>
                  {(f.group || f.src) && <p className="mt-1 text-[12px] text-muted-foreground">{[f.group, f.src].filter(Boolean).join(" · ")}</p>}
                </div>
                {checkable &&
                  (st ? (
                    <button onClick={() => set(i)} className="inline-flex shrink-0 items-center gap-1 text-[13px] text-muted-foreground hover:text-foreground">
                      {st === "right" ? <Check className="size-4 text-ok" /> : null}
                      {st === "right" ? "Right" : "Removed"}
                      <Undo2 className="ml-1 size-3.5" />
                    </button>
                  ) : (
                    <div className="flex shrink-0 gap-1">
                      <button aria-label="Right" onClick={() => set(i, "right")} className="grid size-8 place-items-center rounded-full bg-secondary hover:text-ok">
                        <Check className="size-4" />
                      </button>
                      <button aria-label="Remove" onClick={() => set(i, "removed")} className="grid size-8 place-items-center rounded-full bg-secondary hover:text-destructive">
                        <X className="size-4" />
                      </button>
                    </div>
                  ))}
              </li>
            )
          })}
        </ul>
        <div className="border-t border-border p-4">
          <button className={cn(btn.primary, "w-full")} onClick={() => onOpenChange(false)}>
            Done
          </button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
