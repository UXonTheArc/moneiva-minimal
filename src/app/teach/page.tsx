import { Suspense } from "react"

import { Teach, type TeachPanel } from "@/components/m/teach"

async function Content({ searchParams }: PageProps<"/teach">) {
  const { state, panel } = await searchParams
  const panels: TeachPanel[] = ["rules", "types", "email", "right"]
  return (
    <Teach
      initialPhase={state === "empty" || state === "reading" ? state : "ready"}
      initialPanel={panels.find((p) => p === panel)}
    />
  )
}

export default function TeachPage(props: PageProps<"/teach">) {
  return (
    <Suspense>
      <Content {...props} />
    </Suspense>
  )
}
