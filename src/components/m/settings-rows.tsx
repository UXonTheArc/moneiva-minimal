"use client"

import { MANAGE } from "@/lib/manage"
import { Group, Icon, Row } from "@/components/m/ui"

export function AccountMenuRows() {
  return (
    <Group>
      {MANAGE.map((m) => (
        <Row
          key={m.href}
          href={m.href}
          icon={
            <Icon>
              <m.icon />
            </Icon>
          }
          title={m.label}
          sub={m.sub}
        />
      ))}
    </Group>
  )
}
