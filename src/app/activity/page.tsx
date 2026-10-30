import { Suspense } from "react"

import { Activity } from "@/components/m/activity"

async function Content({ searchParams }: PageProps<"/activity">) {
  const { agent } = await searchParams
  return <Activity initialAgent={typeof agent === "string" ? agent : undefined} />
}

export default function ActivityPage(props: PageProps<"/activity">) {
  return (
    <Suspense>
      <Content {...props} />
    </Suspense>
  )
}
