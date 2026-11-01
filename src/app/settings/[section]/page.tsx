import { Suspense } from "react"
import { notFound } from "next/navigation"
import { Construction } from "lucide-react"

import { MANAGE } from "@/lib/manage"
import { BackLink } from "@/components/m/automate"
import { Card, Empty } from "@/components/m/ui"

const SECTIONS = MANAGE.map((m) => m.href.split("/").pop()!)

export function generateStaticParams() {
  return SECTIONS.map((section) => ({ section }))
}

async function Content({ params }: PageProps<"/settings/[section]">) {
  const { section } = await params
  const m = MANAGE.find((x) => x.href.endsWith("/" + section))
  if (!m) notFound()
  return (
    <>
      <BackLink href="/settings" label="Account" />
      <h1 className="mb-2 text-[34px] leading-tight font-bold tracking-tight sm:text-[40px]">{m.label}</h1>
      <p className="mb-10 text-[17px] text-muted-foreground">{m.sub}.</p>
      <Card>
        <Empty icon={<Construction />} title="Designed in a later round" sub="This screen is part of the management pages, which are not designed yet. It sits here so you can see where it lives." />
      </Card>
    </>
  )
}

export default function SectionPage(props: PageProps<"/settings/[section]">) {
  return (
    <Suspense>
      <Content {...props} />
    </Suspense>
  )
}
