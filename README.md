# Moneiva Minimal

The fourth version of the Moneiva redesign: the whole app simplified to as few actions as possible, with a way to see everything under the hood. All data is synthetic.

## The idea

- **Four places.** Today, Review, Teach and Automate. Activity is one tap away from the clock icon at the top.
- **One thing to do per screen.** Each page leads with a single number and a single button.
- **One at a time.** Review and Teach show one card at a time with one obvious answer (Send, Yes, learn this). On Review, swipe left or right (or use the arrow keys or side arrows) to move between cards. A list view is there when you want it.
- **Management in the account menu.** Click the initials at the top right for Reports, People, Connections, Settings, dark mode and sign out. These screens are placeholders until the management pages are designed.
- **Details stay closed.** Every card has "Show details", "Why this reply" or an "Under the hood" list for the full emails, steps, rules, tools and settings.
- **Calmer look.** Light gray page, white cards, one blue, color only when it means something (red stopped, amber needs you, green fine). Dark mode included. Phone gets a bottom tab bar.

## Pages

| Route | What it is |
| --- | --- |
| `/` | Today: what happened, what needs you, your agents |
| `/review` | Replies and calls to approve, one at a time (`?item=r1` opens one) |
| `/teach` | What the agents know and where it came from (`?state=empty`, `?state=reading`) |
| `/teach/check` | New kinds of email and threads to check, one at a time |
| `/automate` | Agents and workflows side by side (`?view=workflows`) |
| `/automate/agents/[id]` | One agent: op, phone, check, osd, cat |
| `/automate/workflows/[id]` | One workflow: osd, late, missed, latepickup, kpi |
| `/automate/workflows/[id]/edit` | The canvas: add, rename or delete steps, then Publish |
| `/activity` | Everything that happened (`?agent=The Operator`) |
| `/settings` | Account, with links to the management pages |
| `/settings/[section]` | reports, users, connections, general (placeholders) |

Old addresses (/inbox, /playbook, /training, /agents, /workflows) redirect to the new ones.

## Run it

```bash
npm install
npm run dev
```
