import { Suspense } from "react"

import { Teach } from "@/components/m/teach"

async function Content({ searchParams }: PageProps<"/teach">) {
  const { state } = await searchParams
  return <Teach initialPhase={state === "empty" || state === "reading" ? state : "ready"} />
}

export default function TeachPage(props: PageProps<"/teach">) {
  return (
    <Suspense>
      <Content {...props} />
    </Suspense>
  )
}
