"use client"

import Link from "next/link"
import { useState } from "react"
import { ChevronRight, Plus, Workflow as WorkflowIcon } from "lucide-react"
import { toast } from "sonner"

import { KindIcon } from "@/components/m/kind-icon"
import { Card, Details, Dot, Group, Icon, Journey, PageTitle, Row, Segmented, Section } from "@/components/m/ui"
import { AGENTS } from "@/lib/moneiva/agents-data"
import { AGENT_STAGE, STAGE_INFO, WORKFLOWS, agentState, type Workflow } from "@/lib/minimal"

export type AutomateView = "agents" | "workflows"

export function Automate({ initialView }: { initialView: AutomateView }) {
  const [view, setView] = useState<AutomateView>(initialView)
  const live = WORKFLOWS.filter((w) => w.status !== "archived")
  const archived = WORKFLOWS.filter((w) => w.status === "archived")

  return (
    <>
      <PageTitle
        title="Automate"
        lead="Agents do the work. Workflows decide when work happens, with an agent or without one."
        action={
          <div className="flex items-center gap-2">
            <Segmented
              value={view}
              onChange={(v) => {
                setView(v)
                window.history.replaceState(null, "", v === "workflows" ? "/automate?view=workflows" : "/automate")
              }}
              options={[
                { value: "agents", label: "Agents" },
                { value: "workflows", label: "Workflows" },
              ]}
            />
            <button
              aria-label={view === "agents" ? "New agent" : "New workflow"}
              onClick={() => toast("Creating is not part of this mockup yet.")}
              className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground transition hover:brightness-110"
            >
              <Plus className="size-5" />
            </button>
          </div>
        }
      />

      {view === "agents" ? (
        <Group>
          {AGENTS.map((a) => {
            const st = agentState(a)
            const stage = AGENT_STAGE[a.id]
            return (
              <Row
                key={a.id}
                href={`/automate/agents/${a.id}`}
                icon={
                  <Icon>
                    <KindIcon kind={a.kind} />
                  </Icon>
                }
                title={a.name}
                sub={
                  <span className="inline-flex items-center gap-1.5">
                    <Dot tone={st.tone} />
                    {st.tone === "bad" || st.tone === "off" ? st.label : a.channel}
                  </span>
                }
                value={
                  <div className="hidden w-40 sm:block">
                    <Journey stage={stage} compact />
                    <div className="mt-1.5 text-left text-[12px]">{STAGE_INFO[stage].label}</div>
                  </div>
                }
              />
            )
          })}
        </Group>
      ) : (
        <>
          <Group>
            {live.map((w) => (
              <WorkflowRow key={w.id} w={w} />
            ))}
          </Group>
          <Details label={`Show ${archived.length} archived`} className="mt-6 px-1">
            <Group>
              {archived.map((w) => (
                <Row key={w.id} title={w.name} sub={w.archivedOn} className="opacity-70" />
              ))}
            </Group>
          </Details>
        </>
      )}
    </>
  )
}

function WorkflowRow({ w }: { w: Workflow }) {
  const failed = w.last.startsWith("Couldn't")
  const live = w.status === "live"
  return (
    <Row
      href={`/automate/workflows/${w.id}`}
      icon={
        <Icon>
          <WorkflowIcon />
        </Icon>
      }
      title={w.name}
      sub={
        <>
          <span className="flex items-center gap-1.5">
            <Dot tone={failed ? "bad" : live ? "ok" : "off"} />
            <span className="truncate">{failed ? "Last run couldn't finish" : live ? "Live" : "Off"}</span>
          </span>
          <span className="block truncate">{w.sentence}</span>
        </>
      }
    />
  )
}

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="mb-6 inline-flex items-center gap-1 text-[15px] font-medium text-primary">
      <ChevronRight className="size-4 rotate-180" />
      {label}
    </Link>
  )
}

export { Card, Section }
