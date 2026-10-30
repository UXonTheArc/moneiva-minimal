import { Suspense } from "react"
import { notFound } from "next/navigation"

import { WorkflowDetail } from "@/components/m/workflow-detail"
import { WORKFLOWS, workflowById } from "@/lib/minimal"

export function generateStaticParams() {
  return WORKFLOWS.map((w) => ({ id: w.id }))
}

async function Content({ params }: PageProps<"/automate/workflows/[id]">) {
  const { id } = await params
  const w = workflowById(id)
  if (!w) notFound()
  return <WorkflowDetail w={w} />
}

export default function WorkflowPage(props: PageProps<"/automate/workflows/[id]">) {
  return (
    <Suspense>
      <Content {...props} />
    </Suspense>
  )
}
