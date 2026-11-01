"use client"

import { AccountMenuRows } from "@/components/m/settings-rows"
import { Card, PageTitle, Section } from "@/components/m/ui"
import { ME, ORG } from "@/lib/moneiva/data"

export default function SettingsPage() {
  return (
    <>
      <PageTitle title="Account" />
      <Card className="mb-10 flex items-center gap-4 p-6">
        <span className="grid size-14 place-items-center rounded-full bg-foreground text-[17px] font-semibold text-background">{ME.initials}</span>
        <div>
          <div className="text-[20px] font-semibold">{ME.name}</div>
          <div className="text-[15px] text-muted-foreground">
            {ME.email} · {ORG.name}
          </div>
        </div>
      </Card>
      <Section title="Manage">
        <AccountMenuRows />
      </Section>
    </>
  )
}
