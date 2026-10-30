import { Suspense } from "react"

import { Review } from "@/components/m/review"

async function Content({ searchParams }: PageProps<"/review">) {
  const { item } = await searchParams
  return <Review initialId={typeof item === "string" ? item : undefined} />
}

export default function ReviewPage(props: PageProps<"/review">) {
  return (
    <Suspense>
      <Content {...props} />
    </Suspense>
  )
}
