import { Suspense } from "react"

import { Activity } from "@/components/m/activity"

async function Content({ searchParams }: PageProps<"/activity">) {
  const { agent, filter } = await searchParams
  return <Activity initialAgent={typeof agent === "string" ? agent : undefined} initialFilter={filter === "fail" || filter === "needs" ? filter : "all"} />
}

export default function ActivityPage(props: PageProps<"/activity">) {
  return (
    <Suspense>
      <Content {...props} />
    </Suspense>
  )
}
