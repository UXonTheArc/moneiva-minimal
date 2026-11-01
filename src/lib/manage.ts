import { BarChart3, Plug, Settings, Users } from "lucide-react"

/** Management lives with the account, like on a phone: used rarely, always one tap away. */
export const MANAGE = [
  { href: "/settings/reports", label: "Reports", sub: "Emails handled, calls answered and time saved, over time", icon: BarChart3 },
  { href: "/settings/users", label: "People", sub: "Who can approve, teach and change agents", icon: Users },
  { href: "/settings/connections", label: "Connections", sub: "Mailboxes, phone numbers, Acme and the other systems agents use", icon: Plug },
  { href: "/settings/general", label: "Settings", sub: "Company details, hours, time zone and notifications", icon: Settings },
]
