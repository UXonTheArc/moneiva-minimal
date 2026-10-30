import { FileText, Mail, PhoneIncoming, PhoneOutgoing } from "lucide-react"

import type { AgentKind } from "@/lib/moneiva/agents-data"

export function KindIcon({ kind }: { kind: AgentKind }) {
  if (kind === "email") return <Mail />
  if (kind === "inbound") return <PhoneIncoming />
  if (kind === "outbound") return <PhoneOutgoing />
  return <FileText />
}
