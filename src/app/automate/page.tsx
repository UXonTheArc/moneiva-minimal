import { Suspense } from "react"

import { Automate } from "@/components/m/automate"

async function Content({ searchParams }: PageProps<"/automate">) {
  const { view } = await searchParams
  return <Automate initialView={view === "workflows" ? "workflows" : "agents"} />
}

export default function AutomatePage(props: PageProps<"/automate">) {
  return (
    <Suspense>
      <Content {...props} />
    </Suspense>
  )
}
