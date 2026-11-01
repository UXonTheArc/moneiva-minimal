"use client"

import Link from "next/link"
import { LogOut, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { toast } from "sonner"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { ME, ORG } from "@/lib/moneiva/data"
import { MANAGE } from "@/lib/manage"

/** Management lives with the account: used rarely, always one tap away. */
export function AccountMenu() {
  const { resolvedTheme, setTheme } = useTheme()
  const dark = resolvedTheme === "dark"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Account and management"
        className="ml-1 grid size-8 place-items-center rounded-full bg-foreground text-[11px] font-semibold text-background outline-none focus-visible:ring-4 focus-visible:ring-primary/30"
      >
        {ME.initials}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-72 rounded-2xl p-2">
        <DropdownMenuItem asChild className="block rounded-lg px-3 py-2">
          <Link href="/settings">
            <div className="text-[15px] font-semibold">{ME.name}</div>
            <div className="text-[13px] text-muted-foreground">
              {ME.email} · {ORG.name}
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {MANAGE.map((m) => (
          <DropdownMenuItem key={m.href} asChild className="h-10 gap-3 rounded-lg px-3 text-[15px]">
            <Link href={m.href}>
              <m.icon className="size-[18px] text-muted-foreground" />
              {m.label}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="h-10 gap-3 rounded-lg px-3 text-[15px]"
          onSelect={(e) => {
            e.preventDefault()
            setTheme(dark ? "light" : "dark")
          }}
        >
          <Moon className="size-[18px] text-muted-foreground" />
          Dark mode
          <Switch checked={dark} className="pointer-events-none ml-auto" tabIndex={-1} aria-hidden />
        </DropdownMenuItem>
        <DropdownMenuItem className="h-10 gap-3 rounded-lg px-3 text-[15px]" onSelect={() => toast("Signing out is not part of this mockup.")}>
          <LogOut className="size-[18px] text-muted-foreground" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
