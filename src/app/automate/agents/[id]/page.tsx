import { Suspense } from "react"
import { notFound } from "next/navigation"

import { AgentDetail } from "@/components/m/agent-detail"
import { AGENTS, agentById } from "@/lib/moneiva/agents-data"

export function generateStaticParams() {
  return AGENTS.map((a) => ({ id: a.id }))
}

async function Content({ params }: PageProps<"/automate/agents/[id]">) {
  const { id } = await params
  const agent = agentById(id)
  if (!agent) notFound()
  return <AgentDetail agent={agent} />
}

export default function AgentPage(props: PageProps<"/automate/agents/[id]">) {
  return (
    <Suspense>
      <Content {...props} />
    </Suspense>
  )
}
